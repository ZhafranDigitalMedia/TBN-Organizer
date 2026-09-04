export const runtime = "nodejs";

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
          { status: 404 },
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
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const namaPengantin = formData.get("namaPengantin");
    const tanggal_acara = formData.get("tanggal_acara");
    const wilayah = formData.get("wilayah");
    const alamat_lengkap = formData.get("alamat_lengkap");
    const maps_url = formData.get("maps_url"); // 1. TAMBAHKAN INI
    const lokasi_acara = formData.get("lokasi_acara");
    const jumlah_tamu = formData.get("jumlah_tamu");
    const testimoni = formData.get("testimoni");
    const featured = formData.get("featured");

    const files = formData
      .getAll("gambar")
      .filter((file): file is File => file instanceof File && file.size > 0);

    // Validasi input wajib
    if (
      !namaPengantin ||
      !tanggal_acara ||
      !wilayah || // 2. TAMBAHKAN VALIDASI WILAYAH (JIKA WAJIB)
      !lokasi_acara ||
      !jumlah_tamu
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data wajib belum lengkap",
        },
        { status: 400 },
      );
    }

    const docRef = adminDb.collection("pengantin").doc();
    const gambar: string[] = [];
    const uploadedPaths: string[] = [];

    try {
      // 1. Upload file ke Supabase Storage
      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

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

      // 2. Format tanggal & Timestamp Firestore
      const now = Timestamp.now();
      const weddingDate = Timestamp.fromDate(
        new Date(`${String(tanggal_acara)}T00:00:00Z`),
      );

      // 3. Simpan dokumen ke Firestore
      await docRef.set({
        namaPengantin: String(namaPengantin).trim(),
        tanggal_acara: weddingDate,
        wilayah: String(wilayah).trim(),
        lokasi_acara: String(lokasi_acara).trim(),
        alamat_lengkap: alamat_lengkap
          ? String(alamat_lengkap).trim()
          : String(lokasi_acara).trim(),
        maps_url: maps_url ? String(maps_url).trim() : "",
        jumlah_tamu: Number(jumlah_tamu) || 0,
        testimoni: testimoni ? String(testimoni).trim() : "",
        featured: featured === "true" || featured === "on",
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
        { status: 201 },
      );
    } catch (uploadOrSaveError) {
      // Cleanup: Hapus berkas yang ter-upload jika terjadi kegagalan proses
      if (uploadedPaths.length > 0) {
        await supabaseServer.storage.from("pengantin").remove(uploadedPaths);
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
      { status: 500 },
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
        { status: 400 },
      );
    }

    const docRef = adminDb.collection("pengantin").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Data portfolio tidak ditemukan" },
        { status: 404 },
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
      .filter((file): file is File => file instanceof File && file.size > 0);

    const gambarBaru: string[] = [];
    const uploadedPaths: string[] = [];

    // Upload file gambar baru jika ada
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
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

    if (namaPengantin)
      updatePayload.namaPengantin = String(namaPengantin).trim();
    if (lokasi_acara) updatePayload.lokasi_acara = String(lokasi_acara).trim();
    if (jumlah_tamu) updatePayload.jumlah_tamu = Number(jumlah_tamu);
    if (testimoni !== null) updatePayload.testimoni = String(testimoni).trim();
    if (featured !== null) updatePayload.featured = featured === "true";
    if (tanggal_acara) {
      updatePayload.tanggal_acara = Timestamp.fromDate(
        new Date(`${String(tanggal_acara)}T00:00:00Z`),
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
      { status: 500 },
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
        {
          success: false,
          message: "ID portfolio wajib diisi",
        },
        { status: 400 },
      );
    }

    // kode DELETE kamu yang lainnya tetap sama...

    // 1. Cari dokumen di Firestore terlebih dahulu untuk mengambil daftar gambar
    const docRef = adminDb.collection("pengantin").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Data portfolio tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = docSnap.data();

    // 2. Hapus berkas gambar dari Supabase Storage jika ada
    if (data?.gambar && Array.isArray(data.gambar) && data.gambar.length > 0) {
      const pathsToRemove: string[] = [];

      for (const url of data.gambar) {
        try {
          // Ekstrak relative path file dari Public URL
          // Contoh URL: https://.../storage/v1/object/public/pengantin/docId/file.jpg
          const urlObj = new URL(url);
          const pathSegments = urlObj.pathname.split("/pengantin/");
          if (pathSegments.length > 1) {
            pathsToRemove.push(pathSegments[1]);
          }
        } catch (e) {
          console.warn("Gagal parse URL gambar:", url);
        }
      }

      if (pathsToRemove.length > 0) {
        await supabaseServer.storage.from("pengantin").remove(pathsToRemove);
      }
    }

    // 3. Hapus dokumen dari Firestore
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Portfolio berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE portfolio error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server saat menghapus data",
      },
      { status: 500 },
    );
  }
}
