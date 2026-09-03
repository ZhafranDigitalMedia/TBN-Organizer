"use client";

import { Eye, Edit3, Trash2, Calendar, MapPin, Layers, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

type Portfolio = {
  id: string;
  namaPengantin: string;
  tema: string;
  tanggal_acara: {
    _seconds: number;
    _nanoseconds: number;
  };
  lokasi_acara: string;
  jumlah_acara?: number;
  jumlah_tamu?: number;
  jumlahtamu?: number;
  gambar: string[];
  featured: boolean;
};

interface RecentProjectsTableProps {
  selectedYear?: string; // Dapat dipassing dari parent jika memakai state global/bersama
}

export default function RecentProjectsTable({ selectedYear: propYear }: RecentProjectsTableProps) {
  const [projects, setProjects] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalYear, setInternalYear] = useState<string>("ALL");

  // Gunakan propYear jika ada, jika tidak gunakan state internal
  const activeYear = propYear !== undefined ? propYear : internalYear;

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

  // 1. Ekstrak tahun unik untuk dropdown filter (jika propYear tidak dipakai)
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    projects.forEach((item) => {
      if (item.tanggal_acara?._seconds) {
        const year = new Date(item.tanggal_acara._seconds * 1000).getFullYear().toString();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [projects]);

  // 2. Filter daftar proyek berdasarkan tahun aktif
  const filteredProjects = useMemo(() => {
    if (activeYear === "ALL") return projects;
    return projects.filter((item) => {
      if (!item.tanggal_acara?._seconds) return false;
      const year = new Date(item.tanggal_acara._seconds * 1000).getFullYear().toString();
      return year === activeYear;
    });
  }, [projects, activeYear]);

  // Fungsi Eksekusi Hapus
  async function confirmDelete() {
    if (!selectedDelete) return;

    setDeleting(true);

    try {
      let res = await fetch(`/api/portfolio/${selectedDelete.id}`, {
        method: "DELETE",
      });

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
  }

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

  function getJumlah(project: Portfolio) {
    return (
      project.jumlah_tamu ??
      project.jumlahtamu ??
      project.jumlah_acara ??
      "-"
    );
  }

  return (
    <>
      <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded-sm overflow-hidden">
        {/* Header dengan Filter Tahun & Tombol Tambah */}
        <div className="p-4 sm:p-6 border-b border-[#EFEBE4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-lg sm:text-xl text-[#3A2E2B]">
              Proyek Terbaru
            </h2>

            {/* Dropdown Filter (Otomatis tersembunyi jika filter diatur dari parent/StatCards) */}
            {propYear === undefined && (
              <select
                value={internalYear}
                onChange={(e) => setInternalYear(e.target.value)}
                className="bg-[#F5F0E8] border border-[#DCD5C9] text-tbn-dark text-xs font-medium px-2.5 py-1 rounded-xs outline-none focus:border-[#B3765A] cursor-pointer"
              >
                <option value="ALL">Semua Tahun</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Tahun {year}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Link
            href="/admin/portfolio/create"
            className="flex items-center gap-2 bg-[#B3765A] text-white text-xs px-3 py-2 rounded-sm hover:bg-[#9E644A] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Proyek
          </Link>
        </div>

        {/* Content Container */}
        <div>
          {loading ? (
            <div className="py-10 text-center text-sm text-[#8A7A73]">
              Memuat portfolio...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#8A7A73]">
              {activeYear !== "ALL"
                ? `Tidak ada data portfolio untuk tahun ${activeYear}.`
                : "Belum ada portfolio."}
            </div>
          ) : (
            <>
              {/* TAMPILAN MOBILE */}
              <div className="block md:hidden divide-y divide-[#EFEBE4]">
                {filteredProjects.map((project) => {
                  const image =
                    project.gambar && project.gambar.length > 0 && project.gambar[0].trim() !== ""
                      ? project.gambar[0]
                      : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80";

                  return (
                    <div key={project.id} className="p-4 space-y-3">
                      <div className="flex gap-3 items-start">
                        <div className="w-16 h-16 relative bg-gray-200 overflow-hidden rounded-sm shrink-0">
                          <img
                            src={image}
                            alt={project.namaPengantin}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="font-serif text-base text-[#3A2E2B] font-medium truncate">
                              {project.namaPengantin}
                            </p>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase rounded-xs shrink-0 ${
                                project.featured
                                  ? "bg-[#F3ECE2] text-[#B3765A]"
                                  : "bg-[#EAE4DC] text-[#8A7A73]"
                              }`}
                            >
                              {project.featured ? "FEATURED" : "REGULAR"}
                            </span>
                          </div>
                          <p className="text-xs text-[#8A7A73] truncate mt-0.5">
                            {project.tema}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-[#6E5544] bg-[#F5F0E8]/50 p-2.5 rounded-sm">
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="w-3.5 h-3.5 text-[#8A7A73] shrink-0" />
                          <span className="truncate">
                            {formatDate(project.tanggal_acara)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Layers className="w-3.5 h-3.5 text-[#8A7A73] shrink-0" />
                          <span>
                            {getJumlah(project)} Undangan
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#8A7A73] shrink-0" />
                          <span className="truncate">{project.lokasi_acara}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-4 pt-1 text-[#8A7A73]">
                        <Link href={`/portfolio/${project.id}`} className="flex items-center gap-1 text-xs hover:text-[#B3765A] transition-colors">
                          <Eye className="w-4 h-4" /> Lihat
                        </Link>
                        <Link href={`/admin/portfolio/edit/${project.id}`} className="flex items-center gap-1 text-xs hover:text-[#B3765A] transition-colors">
                          <Edit3 className="w-4 h-4" /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedDelete(project)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TAMPILAN DESKTOP */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EFEBE4] text-[11px] uppercase tracking-wider text-[#8A7A73]">
                      <th className="py-4 px-6 font-semibold">FOTO</th>
                      <th className="py-4 px-6 font-semibold">PASANGAN</th>
                      <th className="py-4 px-6 font-semibold">TANGGAL</th>
                      <th className="py-4 px-6 font-semibold">LOKASI</th>
                      <th className="py-4 px-6 font-semibold">JUMLAH UNDANGAN</th>
                      <th className="py-4 px-6 font-semibold">FEATURED</th>
                      <th className="py-4 px-6 font-semibold">AKSI</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EFEBE4] text-sm text-[#6E5544]">
                    {filteredProjects.map((project) => {
                      const image =
                        project.gambar && project.gambar.length > 0 && project.gambar[0].trim() !== ""
                          ? project.gambar[0]
                          : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80";

                      return (
                        <tr key={project.id} className="hover:bg-[#F5F0E8]/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="w-14 h-14 relative bg-gray-200 overflow-hidden rounded-sm">
                              <img src={image} alt={project.namaPengantin} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-serif text-base text-[#3A2E2B] font-medium">{project.namaPengantin}</p>
                            <p className="text-xs text-[#8A7A73]">{project.tema}</p>
                          </td>
                          <td className="py-4 px-6 text-xs">{formatDate(project.tanggal_acara)}</td>
                          <td className="py-4 px-6 text-xs">{project.lokasi_acara}</td>
                          <td className="py-4 px-6 text-xs">{getJumlah(project)} Undangan</td>
                          <td className="py-4 px-6">
                            <span className={`text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase rounded-xs ${
                              project.featured ? "bg-[#F3ECE2] text-[#B3765A]" : "bg-[#EAE4DC] text-[#8A7A73]"
                            }`}>
                              {project.featured ? "YA" : "TIDAK"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3 text-[#8A7A73]">
                              <Link href={`/portfolio/${project.id}`} className="hover:text-[#B3765A] transition-colors">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link href={`/admin/portfolio/edit/${project.id}`} className="hover:text-[#B3765A] transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => setSelectedDelete(project)}
                                className="text-red-600 hover:text-red-700 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAFAF8] border border-[#E8E4DC] rounded-sm max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-[#3A2E2B] font-medium">
                  Konfirmasi Hapus
                </h3>
                <p className="text-xs text-[#8A7A73]">
                  Apakah Anda yakin ingin menghapus portfolio{" "}
                  <strong className="text-[#3A2E2B]">
                    "{selectedDelete.namaPengantin}"
                  </strong>
                  ? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E4DC]">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[#8A7A73] hover:text-[#3A2E2B] transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}