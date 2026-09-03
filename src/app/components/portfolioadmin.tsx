"use client";

import Link from "next/link";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

interface PortfolioItem {
  id: string;
  foto: string;
  pasangan: string;
  tanggal: string;
  lokasi: string;
  tamu: number;
  tipe: "LARGE WEDDING" | "INTIMATE" | "WEDDING";
  featured: boolean;
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "1",
    foto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80",
    pasangan: "Andi & Siti",
    tanggal: "15 Agustus 2026",
    lokasi: "Gedung Graha Sari",
    tamu: 500,
    tipe: "LARGE WEDDING",
    featured: true,
  },
  {
    id: "2",
    foto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=150&q=80",
    pasangan: "Reza & Dewi",
    tanggal: "22 Maret 2026",
    lokasi: "Villa Puncak",
    tamu: 120,
    tipe: "INTIMATE",
    featured: true,
  },
  {
    id: "3",
    foto: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=150&q=80",
    pasangan: "Budi & Ayu",
    tanggal: "5 Mei 2026",
    lokasi: "Hotel Mulia",
    tamu: 300,
    tipe: "WEDDING",
    featured: false,
  },
  {
    id: "4",
    foto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=150&q=80",
    pasangan: "Fajar & Nadia",
    tanggal: "10 Juli 2026",
    lokasi: "Pantai Seminyak",
    tamu: 80,
    tipe: "INTIMATE",
    featured: true,
  },
  {
    id: "5",
    foto: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=150&q=80",
    pasangan: "Hendra & Maya",
    tanggal: "18 Januari 2026",
    lokasi: "Gedung Merdeka",
    tamu: 700,
    tipe: "LARGE WEDDING",
    featured: false,
  },
  {
    id: "6",
    foto: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=150&q=80",
    pasangan: "Dito & Citra",
    tanggal: "14 Februari 2026",
    lokasi: "Taman Langsat",
    tamu: 200,
    tipe: "WEDDING",
    featured: false,
  },
];

export default function ManagePortfolioPage() {
  const handleDelete = (id: string) => {
    // Tambahkan handler hapus data
    console.log("Hapus ID:", id);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] p-6 sm:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[#3D2E24] sm:text-3xl">
          Kelola Portfolio
        </h1>

        <Link
          href="/admin/portfolio/add"
          className="inline-flex items-center gap-2 bg-[#B87A5E] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#A3694E]"
        >
          <Plus className="h-4 w-4" />
          TAMBAH
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-sm border border-[#EFEBE4] bg-[#FAF8F5]">
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
            {PORTFOLIO_DATA.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-[#F5F0E8]/40">
                {/* Foto */}
                <td className="px-6 py-4">
                  <div className="h-12 w-12 overflow-hidden rounded-xs bg-[#E8DFD1]">
                    <img
                      src={item.foto}
                      alt={item.pasangan}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>

                {/* Pasangan */}
                <td className="px-6 py-4 font-serif font-medium">
                  {item.pasangan}
                </td>

                {/* Tanggal */}
                <td className="px-6 py-4 text-[#6E5544]">
                  {item.tanggal}
                </td>

                {/* Lokasi */}
                <td className="px-6 py-4 text-[#6E5544]">
                  {item.lokasi}
                </td>

                {/* Tamu */}
                <td className="px-6 py-4 text-[#6E5544]">
                  {item.tamu}
                </td>

                {/* Tipe Badge */}
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full border border-[#DCD5C9] px-3 py-1 text-[10px] font-medium tracking-wider text-[#8C7361]">
                    {item.tipe}
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
                      onClick={() => handleDelete(item.id)}
                      className="transition-colors hover:text-red-600"
                      aria-label="Hapus portfolio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}