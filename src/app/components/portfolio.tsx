"use client";

import { useState } from "react";
import { Calendar, MapPin, Heart } from "lucide-react";

interface PortfolioItem {
  id: string;
  foto: string;
  pasangan: string;
  tema: string;
  tanggal: string;
  lokasi: string;
  kategori: "WEDDING" | "ENGAGEMENT" | "INTIMATE" | "LARGE WEDDING";
  isFeatured?: boolean;
}

const CATEGORIES = [
  { label: "SEMUA", value: "ALL" },
  { label: "WEDDING", value: "WEDDING" },
  { label: "ENGAGEMENT", value: "ENGAGEMENT" },
  { label: "INTIMATE", value: "INTIMATE" },
  { label: "LARGE WEDDING", value: "LARGE WEDDING" },
];

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "1",
    foto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    pasangan: "Andi & Siti",
    tema: "ELEGANT GARDEN WEDDING",
    tanggal: "15 Agustus 2026",
    lokasi: "Gedung Graha Sari",
    kategori: "WEDDING",
    isFeatured: true,
  },
  {
    id: "2",
    foto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    pasangan: "Reza & Dewi",
    tema: "INTIMATE GARDEN SOIRÉE",
    tanggal: "22 Maret 2026",
    lokasi: "Villa Puncak",
    kategori: "INTIMATE",
    isFeatured: true,
  },
  {
    id: "3",
    foto: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
    pasangan: "Budi & Ayu",
    tema: "CLASSIC BLACK & GOLD",
    tanggal: "5 Mei 2026",
    lokasi: "Hotel Mulia",
    kategori: "LARGE WEDDING",
    isFeatured: false,
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredData =
    activeCategory === "ALL"
      ? PORTFOLIO_DATA
      : PORTFOLIO_DATA.filter((item) => item.kategori === activeCategory);

  return (
    <div className="min-h-screen bg-[#F8F5EE] px-4 py-16 sm:px-8 lg:px-16">
      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B87A5E]">
          PORTFOLIO
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[#3D2E24] sm:text-5xl">
          Our Stories
        </h1>

        <div className="my-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-[#E8DFD1]" />
          <Heart className="h-3 w-3 fill-[#B87A5E] text-[#B87A5E]" />
          <div className="h-px w-12 bg-[#E8DFD1]" />
        </div>

        <p className="text-sm leading-relaxed text-[#8C7361]">
          A collection of beautiful celebrations we&apos;ve had the privilege to create.
        </p>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeCategory === cat.value
                  ? "border-[#B87A5E] bg-[#B87A5E] text-white"
                  : "border-[#E8DFD1] bg-transparent text-[#6E5544] hover:border-[#B87A5E]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Portfolio */}
      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer overflow-hidden border border-[#EFEBE4] bg-[#FAF8F5] transition-all duration-300 hover:shadow-lg"
          >
            {/* Aspect Ratio Container untuk Gambar */}
            <div className="relative aspect-4/3 overflow-hidden bg-[#E8DFD1]">
              <img
                src={item.foto}
                alt={item.pasangan}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Info Portfolio */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-xl text-[#3D2E24]">
                  {item.pasangan}
                </h3>
                {item.isFeatured && (
                  <span className="shrink-0 border border-[#E8DFD1] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#B87A5E]">
                    FEATURED
                  </span>
                )}
              </div>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#B87A5E]">
                {item.tema}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C7361]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-[#A9988B]" />
                  <span>{item.tanggal}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A9988B]" />
                  <span>{item.lokasi}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}