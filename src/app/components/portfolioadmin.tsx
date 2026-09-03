"use client";

import Link from "next/link";
import { Plus, Eye, Pencil, Trash2, Calendar, MapPin, Users, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Portfolio = {
  id: string;
  namaPengantin: string;
  tema: string;
  tanggal_acara: {
    _seconds: number;
    _nanoseconds: number;
  };
  lokasi_acara: string;
  jumlah_tamu: number;
  gambar: string[];
  featured: boolean;
};

export default function ManagePortfolioPage() {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal Hapus
  const [selectedDelete, setSelectedDelete] = useState<Portfolio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch("/api/portfolio");
        const result = await response.json();

        if (result.success) {
          setProjects(result.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  function formatDate(timestamp: Portfolio["tanggal_acara"]) {
    if (!timestamp?._seconds) {
      return "-";
    }

    return new Date(timestamp._seconds * 1000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Fungsi Eksekusi Hapus
  const confirmDelete = async () => {
    if (!selectedDelete) return;

    setDeleting(true);

    try {
      // 1. Coba route dinamis dulu (/api/portfolio/[id])
      let res = await fetch(`/api/portfolio/${selectedDelete.id}`, {
        method: "DELETE",
      });

      // 2. Fallback jika API memakai query param (/api/portfolio?id=xxx)
      if (!res.ok) {
        res = await fetch(`/api/portfolio?id=${selectedDelete.id}`, {
          method: "DELETE",
        });
      }

      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success !== false) {
        setProjects((prev) => prev.filter((item) => item.id !== selectedDelete.id));
        setSelectedDelete(null);
      } else {
        alert(result.message || "Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert("Terjadi kesalahan sistem saat menghapus data.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8F5EE] p-4 sm:p-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <h1 className="font-serif text-xl text-[#3D2E24] sm:text-3xl">
            Kelola Portfolio
          </h1>

          <Link
            href="/admin/portfolio/add"
            className="inline-flex items-center gap-2 bg-[#B87A5E] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#A3694E] sm:px-5 sm:py-2.5"
          >
            <Plus className="h-4 w-4" />
            TAMBAH
          </Link>
        </div>

        {/* Main Container */}
        <div className="overflow-hidden rounded-sm border border-[#EFEBE4] bg-[#FAF8F5]">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#A9988B]">
              Memuat portfolio...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#A9988B]">
              Belum ada portfolio.
            </div>
          ) : (
            <>
              {/* TAMPILAN MOBILE (Card View) */}
              <div className="block divide-y divide-[#EFEBE4] md:hidden">
                {projects.map((item) => {
                  const image =
                    item.gambar && item.gambar.length > 0 && item.gambar[0].trim() !== ""
                      ? item.gambar[0]
                      : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80";

                  return (
                    <div key={item.id} className="space-y-3 p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xs bg-[#E8DFD1]">
                          <img
                            src={image}
                            alt={item.namaPengantin}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate font-serif text-base font-medium text-[#3D2E24]">
                              {item.namaPengantin}
                            </p>
                            <span
                              className={`inline-block shrink-0 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                                item.featured
                                  ? "bg-[#EFE7DE] text-[#B87A5E]"
                                  : "bg-[#EFEBE4] text-[#A9988B]"
                              }`}
                            >
                              {item.featured ? "FEATURED" : "REGULAR"}
                            </span>
                          </div>
                          <span className="mt-1 inline-block rounded-full border border-[#DCD5C9] px-2.5 py-0.5 text-[9px] font-medium tracking-wider text-[#8C7361]">
                            {item.tema}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 rounded-xs bg-[#F5F0E8]/50 p-2.5 text-xs text-[#6E5544]">
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#A9988B]" />
                          <span className="truncate">{formatDate(item.tanggal_acara)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Users className="h-3.5 w-3.5 shrink-0 text-[#A9988B]" />
                          <span>{(item.jumlah_tamu || 0).toLocaleString("id-ID")} Tamu</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A9988B]" />
                          <span className="truncate">{item.lokasi_acara}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-4 pt-1 text-[#A9988B]">
                        <Link
                          href={`/portfolio/${item.id}`}
                          className="flex items-center gap-1 text-xs transition-colors hover:text-[#3D2E24]"
                        >
                          <Eye className="h-4 w-4" /> Lihat
                        </Link>
                        <Link
                          href={`/admin/portfolio/edit/${item.id}`}
                          className="flex items-center gap-1 text-xs transition-colors hover:text-[#B87A5E]"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedDelete(item)}
                          className="flex items-center gap-1 text-xs text-red-600 transition-colors hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" /> Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TAMPILAN DESKTOP (Table View) */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#EFEBE4] text-[11px] font-semibold uppercase tracking-wider text-[#A9988B]">
                      <th className="px-6 py-4">FOTO</th>
                      <th className="px-6 py-4">PASANGAN</th>
                      <th className="px-6 py-4">TANGGAL</th>
                      <th className="px-6 py-4">LOKASI</th>
                      <th className="px-6 py-4">TAMU</th>
                      <th className="px-6 py-4">TIPE</th>
                      <th className="px-6 py-4">FEATURED</th>
                      <th className="px-6 py-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFEBE4] text-sm text-[#3D2E24]">
                    {projects.map((item) => {
                      const image =
                        item.gambar && item.gambar.length > 0 && item.gambar[0].trim() !== ""
                          ? item.gambar[0]
                          : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80";

                      return (
                        <tr key={item.id} className="transition-colors hover:bg-[#F5F0E8]/40">
                          {/* Foto */}
                          <td className="px-6 py-4">
                            <div className="h-12 w-12 overflow-hidden rounded-xs bg-[#E8DFD1]">
                              <img
                                src={image}
                                alt={item.namaPengantin}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>

                          {/* Pasangan */}
                          <td className="px-6 py-4 font-serif font-medium">
                            {item.namaPengantin}
                          </td>

                          {/* Tanggal */}
                          <td className="px-6 py-4 text-xs text-[#6E5544]">
                            {formatDate(item.tanggal_acara)}
                          </td>

                          {/* Lokasi */}
                          <td className="px-6 py-4 text-xs text-[#6E5544]">
                            {item.lokasi_acara}
                          </td>

                          {/* Tamu */}
                          <td className="px-6 py-4 text-xs text-[#6E5544]">
                            {(item.jumlah_tamu || 0).toLocaleString("id-ID")}
                          </td>

                          {/* Tipe Badge */}
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-full border border-[#DCD5C9] px-3 py-1 text-[10px] font-medium tracking-wider text-[#8C7361]">
                              {item.tema}
                            </span>
                          </td>

                          {/* Featured Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                                item.featured
                                  ? "bg-[#EFE7DE] text-[#B87A5E]"
                                  : "bg-[#EFEBE4] text-[#A9988B]"
                              }`}
                            >
                              {item.featured ? "YA" : "TIDAK"}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3 text-[#A9988B]">
                              <Link
                                href={`/portfolio/${item.id}`}
                                className="transition-colors hover:text-[#3D2E24]"
                                aria-label="Lihat detail"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/admin/portfolio/edit/${item.id}`}
                                className="transition-colors hover:text-[#B87A5E]"
                                aria-label="Edit portfolio"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => setSelectedDelete(item)}
                                className="text-red-600 transition-colors hover:text-red-700"
                                aria-label="Hapus portfolio"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {selectedDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md space-y-4 rounded-sm border border-[#E8E4DC] bg-[#FAF8F5] p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-full bg-red-100 p-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-medium text-[#3D2E24]">
                  Konfirmasi Hapus
                </h3>
                <p className="text-xs text-[#8C7361]">
                  Apakah Anda yakin ingin menghapus portfolio{" "}
                  <strong className="text-[#3D2E24]">
                    "{selectedDelete.namaPengantin}"
                  </strong>
                  ? Data yang terhapus tidak dapat dikembalikan.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E8E4DC] pt-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[#8C7361] transition-colors hover:text-[#3D2E24] disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex items-center gap-1.5 rounded-xs bg-red-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}