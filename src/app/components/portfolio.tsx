"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, Heart, Loader2 } from "lucide-react";
import Footer from "../components/Footer";

type Portfolio = {
  id: string;
  namaPengantin: string;
  tema: string;
  tanggal_acara?: {
    _seconds: number;
    _nanoseconds: number;
  };
  lokasi_acara: string;
  kategori?: "WEDDING" | "ENGAGEMENT" | "INTIMATE" | "LARGE WEDDING" | string;
  gambar?: string[];
  featured?: boolean;
};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  // Fetch data dari API Firestore
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch("/api/portfolio");
        const result = await response.json();

        if (result.success) {
          setPortfolio(result.data || []);
        }
      } catch (error) {
        console.error("Gagal mengambil data portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  // 1. Ekstrak daftar tahun unik secara dinamis
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    portfolio.forEach((item) => {
      if (item.tanggal_acara?._seconds) {
        const year = new Date(item.tanggal_acara._seconds * 1000).getFullYear().toString();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [portfolio]);

  // 2. Filter gabungan (Kategori + Tahun)
  const filteredData = useMemo(() => {
    return portfolio.filter((item) => {
      // Match Kategori
      const categoryMatch =
        activeCategory === "ALL" ||
        (item.kategori && item.kategori.toUpperCase() === activeCategory);

      // Match Tahun
      let yearMatch = true;
      if (selectedYear !== "ALL") {
        if (!item.tanggal_acara?._seconds) {
          yearMatch = false;
        } else {
          const itemYear = new Date(item.tanggal_acara._seconds * 1000).getFullYear().toString();
          yearMatch = itemYear === selectedYear;
        }
      }

      return categoryMatch && yearMatch;
    });
  }, [portfolio, activeCategory, selectedYear]);

  // Format tanggal Timestamp ke teks Indonesia
  function formatDate(timestamp: Portfolio["tanggal_acara"]) {
    if (!timestamp?._seconds) return "-";
    return new Date(timestamp._seconds * 1000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-tbn-cream">
      <main className="flex-1 px-4 py-16 sm:px-8 lg:px-16">
        {/* Header Section */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-tbn-terracotta">
            PORTFOLIO
          </p>

          <h1 className="mt-3 font-serif text-4xl text-tbn-dark sm:text-5xl">
            Our Stories
          </h1>

          <div className="my-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#E8DFD1]" />
            <Heart className="h-3 w-3 fill-tbn-terracotta text-tbn-terracotta" />
            <div className="h-px w-12 bg-[#E8DFD1]" />
          </div>

          <p className="text-sm leading-relaxed text-[#8C7361]">
            A collection of beautiful celebrations we&apos;ve had the privilege to create.
          </p>

          {/* Control Bar: Filter Tahun */}
          <div className="mt-10 space-y-4">
            {availableYears.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-xs text-[#8C7361]">
                <span className="font-medium">Tahun:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E8DFD1] text-tbn-dark text-xs font-semibold px-3 py-1.5 rounded-xs outline-none focus:border-tbn-terracotta cursor-pointer"
                >
                  <option value="ALL">Semua Tahun</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      Tahun {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Grid Portfolio */}
        <div className="mx-auto mt-14 max-w-7xl">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-[#8C7361]">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm">Memuat portofolio...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#8C7361]">
              Tidak ada portofolio yang cocok dengan filter yang dipilih.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((item) => {
                const image =
                  item.gambar && item.gambar.length > 0 && item.gambar[0].trim() !== ""
                    ? item.gambar[0]
                    : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80";

                return (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.id}`}
                    className="group block overflow-hidden border border-[#EFEBE4] bg-[#FAF8F5] transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Aspect Ratio Container untuk Gambar */}
                    <div className="relative aspect-4/3 overflow-hidden bg-[#E8DFD1]">
                      <img
                        src={image}
                        alt={item.namaPengantin}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info Portfolio */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-xl text-tbn-dark transition-colors group-hover:text-tbn-terracotta">
                          {item.namaPengantin}
                        </h3>
                        {item.featured && (
                          <span className="shrink-0 border border-[#E8DFD1] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-tbn-terracotta">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-tbn-terracotta">
                        {item.tema}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C7361]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#A9988B]" />
                          <span>{formatDate(item.tanggal_acara)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A9988B]" />
                          <span>{item.lokasi_acara}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer Komponen */}
      <Footer />
    </div>
  );
}