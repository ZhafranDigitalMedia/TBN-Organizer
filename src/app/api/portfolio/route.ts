import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../../../lib/firebase/admin";
import { supabaseServer } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // 1. Jika ada query `id`, kembalikan detail 1 dokumen
    if (id) {
      const docRef = adminDb.collection("pengantin").doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json(
          { success: false, message: "Data portfolio tidak ditemukan" },
          { status: 404 }
        );
      }

      const rawData = docSnap.data();

      // Normalisasi field agar sesuai dengan tipe PortfolioDetail di Frontend
      const data = {
        id: docSnap.id,
        ...rawData,
        lokasi: rawData?.lokasi || rawData?.lokasi_acara || "-",
        jumlahTamu: rawData?.jumlahTamu || rawData?.jumlah_tamu || "-",
      };

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // 2. Jika tidak ada query `id`, kembalikan semua daftar data (list)
    const snapshot = await adminDb
      .collection("pengantin")
      .orderBy("createdAt", "desc")
      .get();

    const data = snapshot.docs.map((doc) => {
      const rawData = doc.data();
      return {
        id: doc.id,
        ...rawData,
        lokasi: rawData.lokasi || rawData.lokasi_acara || "-",
        jumlahTamu: rawData.jumlahTamu || rawData.jumlah_tamu || "-",
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET portfolio error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data portfolio",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const namaPengantin = formData.get("namaPengantin");
    const tanggal_acara = formData.get("tanggal_acara");
    const lokasi_acara = formData.get("lokasi_acara");
    const jumlah_tamu = formData.get("jumlah_tamu");
    const testimoni = formData.get("testimoni");
    const featured = formData.get("featured");

    const files = formData
      .getAll("gambar")
      .filter(
        (file): file is File =>
          file instanceof File && file.size > 0
      );

    if (
      !namaPengantin ||
      !tanggal_acara ||
      !lokasi_acara ||
      !jumlah_tamu
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data wajib belum lengkap",
        },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("pengantin").doc();
    const gambar: string[] = [];
    const uploadedPaths: string[] = [];

    try {
      for (const file of files) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `${docRef.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabaseServer.storage
          .from("pengantin")
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedPaths.push(filePath);

        const { data: publicUrlData } = supabaseServer.storage
          .from("pengantin")
          .getPublicUrl(filePath);

        gambar.push(publicUrlData.publicUrl);
      }

      const now = Timestamp.now();

      const weddingDate = Timestamp.fromDate(
        new Date(`${String(tanggal_acara)}T00:00:00Z`)
      );

      await docRef.set({
        namaPengantin: String(namaPengantin).trim(),
        tanggal_acara: weddingDate,
        lokasi_acara: String(lokasi_acara).trim(),
        jumlah_tamu: Number(jumlah_tamu),
        testimoni: testimoni ? String(testimoni).trim() : "",
        featured: featured === "true",
        gambar,
        createdAt: now,
        updatedAt: now,
      });

      return NextResponse.json(
        {
          success: true,
          id: docRef.id,
          message: "Portfolio berhasil dibuat",
          gambar,
        },
        { status: 201 }
      );
    } catch (uploadOrSaveError) {
      if (uploadedPaths.length > 0) {
        await supabaseServer.storage
          .from("pengantin")
          .remove(uploadedPaths);
      }

      throw uploadOrSaveError;
    }
  } catch (error) {
    console.error("POST portfolio error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat portfolio",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// 1. EDIT / UPDATE (PUT)
// ==========================================
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID Portfolio wajib disertakan" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("pengantin").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Data portfolio tidak ditemukan" },
        { status: 404 }
      );
    }

    // Field Form
    const namaPengantin = formData.get("namaPengantin");
    const tanggal_acara = formData.get("tanggal_acara");
    const lokasi_acara = formData.get("lokasi_acara");
    const jumlah_tamu = formData.get("jumlah_tamu");
    const testimoni = formData.get("testimoni");
    const featured = formData.get("featured");

    // Ambil gambar lama yang dipertahankan
    const gambarLama = formData.getAll("gambarLama") as string[];

    // File gambar baru
    const newFiles = formData
      .getAll("gambar")
      .filter(
        (file): file is File =>
          file instanceof File && file.size > 0
      );

    const gambarBaru: string[] = [];
    const uploadedPaths: string[] = [];

    // Upload file gambar baru jika ada
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `${id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabaseServer.storage
          .from("pengantin")
          .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedPaths.push(filePath);

        const { data: publicUrlData } = supabaseServer.storage
          .from("pengantin")
          .getPublicUrl(filePath);

        gambarBaru.push(publicUrlData.publicUrl);
      }
    }

    // Gabungkan gambar lama dan baru
    const finalGambar = [...gambarLama, ...gambarBaru];

    // Persiapkan payload update
    const updatePayload: Record<string, any> = {
      updatedAt: Timestamp.now(),
      gambar: finalGambar,
    };

    if (namaPengantin) updatePayload.namaPengantin = String(namaPengantin).trim();
    if (lokasi_acara) updatePayload.lokasi_acara = String(lokasi_acara).trim();
    if (jumlah_tamu) updatePayload.jumlah_tamu = Number(jumlah_tamu);
    if (testimoni !== null) updatePayload.testimoni = String(testimoni).trim();
    if (featured !== null) updatePayload.featured = featured === "true";
    if (tanggal_acara) {
      updatePayload.tanggal_acara = Timestamp.fromDate(
        new Date(`${String(tanggal_acara)}T00:00:00Z`)
      );
    }

    await docRef.update(updatePayload);

    return NextResponse.json({
      success: true,
      message: "Portfolio berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT portfolio error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui portfolio" },
      { status: 500 }
    );
  }
}

// ==========================================
// 2. DELETE (DELETE)
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID Portfolio tidak ditemukan" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("pengantin").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // 1. Hapus semua gambar terkait dari folder Supabase Storage (`{id}/...`)
    const { data: filesInFolder, error: listError } = await supabaseServer.storage
      .from("pengantin")
      .list(id);

    if (!listError && filesInFolder && filesInFolder.length > 0) {
      const pathsToDelete = filesInFolder.map((f) => `${id}/${f.name}`);
      await supabaseServer.storage.from("pengantin").remove(pathsToDelete);
    }

    // 2. Hapus dokumen di Firestore
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Portfolio dan seluruh filenya berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE portfolio error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus portfolio" },
      { status: 500 }
    );
  }
}