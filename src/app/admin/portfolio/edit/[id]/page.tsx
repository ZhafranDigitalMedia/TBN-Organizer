"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditPortfolioPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [loadingFetch, setLoadingFetch] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Form Data
  const [namaPengantin, setNamaPengantin] = useState("");
  const [tanggalAcara, setTanggalAcara] = useState("");
  const [lokasiAcara, setLokasiAcara] = useState("");
  const [jumlahTamu, setJumlahTamu] = useState("");
  const [testimoni, setTestimoni] = useState("");
  const [featured, setFeatured] = useState(false);

  // State Gambar
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // Fetch Data Existing
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch("/api/portfolio");
        const result = await res.json();

        if (result.success) {
          const currentData = result.data.find((item: any) => item.id === id);

          if (currentData) {
            setNamaPengantin(currentData.namaPengantin || "");
            setLokasiAcara(currentData.lokasi_acara || "");
            setJumlahTamu(
              currentData.jumlah_tamu || currentData.jumlahtamu || ""
            );
            setTestimoni(currentData.testimoni || "");
            setFeatured(Boolean(currentData.featured));
            setExistingImages(currentData.gambar || []);

            if (currentData.tanggal_acara?._seconds) {
              const dateObj = new Date(
                currentData.tanggal_acara._seconds * 1000
              );
              const formattedDate = dateObj.toISOString().split("T")[0];
              setTanggalAcara(formattedDate);
            }
          }
        }
      } catch (err) {
        console.error("Gagal mengambil detail portfolio:", err);
      } finally {
        setLoadingFetch(false);
      }
    }

    if (id) fetchDetail();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...selectedFiles]);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setNewPreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("namaPengantin", namaPengantin);
      formData.append("tanggal_acara", tanggalAcara);
      formData.append("lokasi_acara", lokasiAcara);
      formData.append("jumlah_tamu", jumlahTamu);
      formData.append("testimoni", testimoni);
      formData.append("featured", String(featured));

      existingImages.forEach((url) => {
        formData.append("gambarLama", url);
      });

      newFiles.forEach((file) => {
        formData.append("gambar", file);
      });

      const res = await fetch("/api/portfolio", {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        alert("Portfolio berhasil diperbarui!");
        router.push("/admin/portfolio");
        router.refresh();
      } else {
        alert(result.message || "Gagal memperbarui portfolio.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Terjadi kesalahan sistem saat memperbarui data.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center text-[#8A7A73] text-sm">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#B3765A]" />
        Memuat data portfolio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="p-2 border border-[#E8E4DC] rounded-sm bg-[#FAFAF8] hover:bg-[#F2ECE4] text-[#8A7A73] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#3A2E2B]">
              Edit Portfolio
            </h1>
            <p className="text-xs text-[#8A7A73]">
              Perbarui informasi pasangan dan dokumentasi acara
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#FAFAF8] border border-[#E8E4DC] rounded-sm p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nama Pengantin */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#8A7A73] uppercase tracking-wider">
                Nama Pasangan / Pengantin *
              </label>
              <input
                type="text"
                required
                value={namaPengantin}
                onChange={(e) => setNamaPengantin(e.target.value)}
                placeholder="Contoh: Eko & Nia"
                className="w-full bg-[#F9F6F0] border border-[#E8E4DC] px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#B3765A] text-[#3A2E2B]"
              />
            </div>

            {/* Tanggal Acara */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A7A73] uppercase tracking-wider">
                Tanggal Acara *
              </label>
              <input
                type="date"
                required
                value={tanggalAcara}
                onChange={(e) => setTanggalAcara(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-[#E8E4DC] px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#B3765A] text-[#3A2E2B]"
              />
            </div>

            {/* Jumlah Tamu / Undangan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#8A7A73] uppercase tracking-wider">
                Jumlah Undangan *
              </label>
              <input
                type="number"
                required
                value={jumlahTamu}
                onChange={(e) => setJumlahTamu(e.target.value)}
                placeholder="300"
                className="w-full bg-[#F9F6F0] border border-[#E8E4DC] px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#B3765A] text-[#3A2E2B]"
              />
            </div>

            {/* Lokasi Acara */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#8A7A73] uppercase tracking-wider">
                Lokasi Acara *
              </label>
              <input
                type="text"
                required
                value={lokasiAcara}
                onChange={(e) => setLokasiAcara(e.target.value)}
                placeholder="Contoh: Gedung Jakarta"
                className="w-full bg-[#F9F6F0] border border-[#E8E4DC] px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#B3765A] text-[#3A2E2B]"
              />
            </div>

            {/* Testimoni */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#8A7A73] uppercase tracking-wider">
                Testimoni
              </label>
              <textarea
                rows={3}
                value={testimoni}
                onChange={(e) => setTestimoni(e.target.value)}
                placeholder="Ulasan atau pesan dari pasangan..."
                className="w-full bg-[#F9F6F0] border border-[#E8E4DC] px-3.5 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#B3765A] text-[#3A2E2B]"
              />
            </div>

            {/* Checkbox Featured */}
            <div className="flex items-center gap-2 sm:col-span-2 pt-1">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#B3765A] rounded-xs cursor-pointer"
              />
              <label
                htmlFor="featured"
                className="text-xs font-medium text-[#3A2E2B] cursor-pointer select-none"
              >
                Tampilkan di Halaman Utama (Featured)
              </label>
            </div>
          </div>

          {/* Section Galeri Gambar */}
          <div className="space-y-4 pt-4 border-t border-[#E8E4DC]">
            <label className="text-xs font-semibold text-[#8A7A73] uppercase tracking-wider block">
              Kelola Foto Dokumentasi
            </label>

            {/* Preview Gambar Saat Ini */}
            {existingImages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#8A7A73]">Foto Tersimpan:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {existingImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group w-full h-24 bg-[#E8E4DC] rounded-sm overflow-hidden border border-[#E8E4DC]"
                    >
                      <img
                        src={url}
                        alt={`Existing ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Gambar Baru */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] text-[#8A7A73]">Tambah Foto Baru:</span>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E8E4DC] rounded-sm cursor-pointer bg-[#F9F6F0] hover:bg-[#F2ECE4] transition-colors">
                  <div className="flex flex-col items-center justify-center text-[#8A7A73]">
                    <Upload className="w-5 h-5 mb-1 text-[#B3765A]" />
                    <p className="text-xs">Klik untuk memilih foto baru</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Preview Gambar Baru */}
            {newPreviews.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] text-[#8A7A73]">Foto Baru yang Akan Ditambahkan:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {newPreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group w-full h-24 bg-[#E8E4DC] rounded-sm overflow-hidden border border-[#E8E4DC]"
                    >
                      <img
                        src={url}
                        alt={`New Preview ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4DC]">
            <Link
              href="/admin/portfolio"
              className="px-4 py-2 text-xs font-medium text-[#8A7A73] hover:text-[#3A2E2B] transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-[#B3765A] hover:bg-[#9E644A] text-white text-xs px-6 py-2.5 rounded-xs font-medium uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? "Memproses..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}