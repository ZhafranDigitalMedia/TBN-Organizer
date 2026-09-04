export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "../../../lib/firebase/admin";
import { supabaseServer } from "../../../lib/supabase/server";

// ==========================================
// GET - LIST / DETAIL PORTFOLIO
// ==========================================
export async function GET(request: Request) {
  try {
    const adminDb = getAdminDb();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Jika ada ID, ambil detail satu portfolio
    if (id) {
      const docRef = adminDb.collection("pengantin").doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json(
          {
            success: false,
            message: "Data portfolio tidak ditemukan",
          },
          { status: 404 },
        );
      }

      const rawData = docSnap.data();

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

    // Jika tidak ada ID, ambil semua portfolio
    const snapshot = await adminDb
      .collection("pengantin")
      .orderBy("createdAt", "desc")
      .get();

    const data = snapshot.docs.map((doc) => {
      const rawData = doc.data();

      return {
        id: doc.id,
        ...rawData,
        lokasi: rawData?.lokasi || rawData?.lokasi_acara || "-",
        jumlahTamu: rawData?.jumlahTamu || rawData?.jumlah_tamu || "-",
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

// ==========================================
// POST - BUAT PORTFOLIO BARU
// ==========================================
export async function POST(request: Request) {
  try {
    const adminDb = getAdminDb();

    const formData = await request.formData();

    const namaPengantin = formData.get("namaPengantin");
    const tanggal_acara = formData.get("tanggal_acara");
    const wilayah = formData.get("wilayah");
    const alamat_lengkap = formData.get("alamat_lengkap");
    const maps_url = formData.get("maps_url");
    const lokasi_acara = formData.get("lokasi_acara");
    const jumlah_tamu = formData.get("jumlah_tamu");
    const testimoni = formData.get("testimoni");
    const featured = formData.get("featured");

    const files = formData
      .getAll("gambar")
      .filter(
        (file): file is File =>
          file instanceof File && file.size > 0,
      );

    // Validasi input wajib
    if (
      !namaPengantin ||
      !tanggal_acara ||
      !wilayah ||
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
      // ==========================================
      // UPLOAD GAMBAR KE SUPABASE
      // ==========================================
      for (const file of files) {
        const extension =
          file.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath = `${docRef.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabaseServer.storage
            .from("pengantin")
            .upload(filePath, file, {
              contentType: file.type,
              upsert: false,
            });

        if (uploadError) {
          throw uploadError;
        }

        uploadedPaths.push(filePath);

        const { data: publicUrlData } =
          supabaseServer.storage
            .from("pengantin")
            .getPublicUrl(filePath);

        gambar.push(publicUrlData.publicUrl);
      }

      // ==========================================
      // FORMAT TANGGAL
      // ==========================================
      const now = Timestamp.now();

      const weddingDate = Timestamp.fromDate(
        new Date(`${String(tanggal_acara)}T00:00:00Z`),
      );

      // ==========================================
      // SIMPAN KE FIRESTORE
      // ==========================================
      await docRef.set({
        namaPengantin: String(namaPengantin).trim(),

        tanggal_acara: weddingDate,

        wilayah: String(wilayah).trim(),

        lokasi_acara: String(lokasi_acara).trim(),

        alamat_lengkap: alamat_lengkap
          ? String(alamat_lengkap).trim()
          : String(lokasi_acara).trim(),

        maps_url: maps_url
          ? String(maps_url).trim()
          : "",

        jumlah_tamu: Number(jumlah_tamu) || 0,

        testimoni: testimoni
          ? String(testimoni).trim()
          : "",

        featured:
          featured === "true" ||
          featured === "on",

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
      // ==========================================
      // CLEANUP GAMBAR JIKA FIRESTORE GAGAL
      // ==========================================
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
      { status: 500 },
    );
  }
}

// ==========================================
// PUT - UPDATE PORTFOLIO
// ==========================================
export async function PUT(request: Request) {
  try {
    const adminDb = getAdminDb();

    const formData = await request.formData();

    const idValue = formData.get("id");

    const id =
      typeof idValue === "string"
        ? idValue.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID Portfolio wajib disertakan",
        },
        { status: 400 },
      );
    }

    const docRef = adminDb
      .collection("pengantin")
      .doc(id);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Data portfolio tidak ditemukan",
        },
        { status: 404 },
      );
    }

    // ==========================================
    // FIELD FORM
    // ==========================================
    const namaPengantin =
      formData.get("namaPengantin");

    const tanggal_acara =
      formData.get("tanggal_acara");

    const wilayah =
      formData.get("wilayah");

    const alamat_lengkap =
      formData.get("alamat_lengkap");

    const maps_url =
      formData.get("maps_url");

    const lokasi_acara =
      formData.get("lokasi_acara");

    const jumlah_tamu =
      formData.get("jumlah_tamu");

    const testimoni =
      formData.get("testimoni");

    const featured =
      formData.get("featured");

    // ==========================================
    // GAMBAR LAMA
    // ==========================================
    const gambarLama = formData
      .getAll("gambarLama")
      .filter(
        (value): value is string =>
          typeof value === "string" &&
          value.trim() !== "",
      );

    // ==========================================
    // GAMBAR BARU
    // ==========================================
    const newFiles = formData
      .getAll("gambar")
      .filter(
        (file): file is File =>
          file instanceof File &&
          file.size > 0,
      );

    const gambarBaru: string[] = [];
    const uploadedPaths: string[] = [];

    try {
      // ==========================================
      // UPLOAD GAMBAR BARU
      // ==========================================
      if (newFiles.length > 0) {
        for (const file of newFiles) {
          const extension =
            file.name
              .split(".")
              .pop()
              ?.toLowerCase() || "jpg";

          const filePath = `${id}/${crypto.randomUUID()}.${extension}`;

          const { error: uploadError } =
            await supabaseServer.storage
              .from("pengantin")
              .upload(filePath, file, {
                contentType: file.type,
                upsert: false,
              });

          if (uploadError) {
            throw uploadError;
          }

          uploadedPaths.push(filePath);

          const { data: publicUrlData } =
            supabaseServer.storage
              .from("pengantin")
              .getPublicUrl(filePath);

          gambarBaru.push(
            publicUrlData.publicUrl,
          );
        }
      }

      // ==========================================
      // GABUNGKAN GAMBAR
      // ==========================================
      const finalGambar = [
        ...gambarLama,
        ...gambarBaru,
      ];

      // ==========================================
      // PAYLOAD UPDATE
      // ==========================================
      const updatePayload: Record<string, any> = {
        updatedAt: Timestamp.now(),
        gambar: finalGambar,
      };

      if (namaPengantin) {
        updatePayload.namaPengantin =
          String(namaPengantin).trim();
      }

      if (wilayah) {
        updatePayload.wilayah =
          String(wilayah).trim();
      }

      if (alamat_lengkap) {
        updatePayload.alamat_lengkap =
          String(alamat_lengkap).trim();
      }

      if (maps_url !== null) {
        updatePayload.maps_url =
          String(maps_url).trim();
      }

      if (lokasi_acara) {
        updatePayload.lokasi_acara =
          String(lokasi_acara).trim();
      }

      if (jumlah_tamu) {
        updatePayload.jumlah_tamu =
          Number(jumlah_tamu);
      }

      if (testimoni !== null) {
        updatePayload.testimoni =
          String(testimoni).trim();
      }

      if (featured !== null) {
        updatePayload.featured =
          featured === "true" ||
          featured === "on";
      }

      if (tanggal_acara) {
        updatePayload.tanggal_acara =
          Timestamp.fromDate(
            new Date(
              `${String(tanggal_acara)}T00:00:00Z`,
            ),
          );
      }

      // ==========================================
      // UPDATE FIRESTORE
      // ==========================================
      await docRef.update(updatePayload);

      return NextResponse.json({
        success: true,
        message: "Portfolio berhasil diperbarui",
      });
    } catch (updateError) {
      // ==========================================
      // CLEANUP GAMBAR BARU
      // ==========================================
      if (uploadedPaths.length > 0) {
        await supabaseServer.storage
          .from("pengantin")
          .remove(uploadedPaths);
      }

      throw updateError;
    }
  } catch (error) {
    console.error("PUT portfolio error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui portfolio",
      },
      { status: 500 },
    );
  }
}

// ==========================================
// DELETE - HAPUS PORTFOLIO
// ==========================================
export async function DELETE(request: Request) {
  try {
    const adminDb = getAdminDb();

    const { searchParams } =
      new URL(request.url);

    const id =
      searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID portfolio wajib diisi",
        },
        { status: 400 },
      );
    }

    // ==========================================
    // AMBIL DOKUMEN FIRESTORE
    // ==========================================
    const docRef = adminDb
      .collection("pengantin")
      .doc(id);

    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Data portfolio tidak ditemukan",
        },
        { status: 404 },
      );
    }

    const data = docSnap.data();

    // ==========================================
    // HAPUS GAMBAR SUPABASE
    // ==========================================
    if (
      data?.gambar &&
      Array.isArray(data.gambar) &&
      data.gambar.length > 0
    ) {
      const pathsToRemove: string[] = [];

      for (const url of data.gambar) {
        try {
          const urlObj = new URL(url);

          const marker = "/pengantin/";

          const pathname =
            urlObj.pathname;

          const index =
            pathname.indexOf(marker);

          if (index !== -1) {
            const filePath =
              pathname.substring(
                index + marker.length,
              );

            if (filePath) {
              pathsToRemove.push(filePath);
            }
          }
        } catch (error) {
          console.warn(
            "Gagal parse URL gambar:",
            url,
          );
        }
      }

      if (pathsToRemove.length > 0) {
        const { error: removeError } =
          await supabaseServer.storage
            .from("pengantin")
            .remove(pathsToRemove);

        if (removeError) {
          console.warn(
            "Gagal menghapus beberapa gambar:",
            removeError,
          );
        }
      }
    }

    // ==========================================
    // HAPUS DOKUMEN FIRESTORE
    // ==========================================
    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Portfolio berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "DELETE portfolio error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan server saat menghapus data",
      },
      { status: 500 },
    );
  }
}