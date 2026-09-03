"use client";

import { useEffect, useState, useMemo } from "react";
import { Image as ImageIcon, Star, Layers, Clock, Calendar } from "lucide-react";

type Portfolio = {
  id: string;
  namaPengantin: string;
  jumlah_acara: number;
  featured: boolean;
  tanggal_acara?: {
    _seconds: number;
    _nanoseconds: number;
  };
};

// Tambahkan interface props
interface StatCardsProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export default function StatCards({ selectedYear, setSelectedYear }: StatCardsProps) {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

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

  const filteredPortfolio = useMemo(() => {
    if (selectedYear === "ALL") return portfolio;
    return portfolio.filter((item) => {
      if (!item.tanggal_acara?._seconds) return false;
      const year = new Date(item.tanggal_acara._seconds * 1000).getFullYear().toString();
      return year === selectedYear;
    });
  }, [portfolio, selectedYear]);

  const totalPortfolio = filteredPortfolio.length;
  const totalFeatured = filteredPortfolio.filter((item) => item.featured === true).length;
  const totalAcara = filteredPortfolio.reduce((total, item) => total + (item.jumlah_acara || 1), 0);
  const tahunAktif = selectedYear !== "ALL" ? selectedYear : availableYears[0] || new Date().getFullYear().toString();

  const stats = [
    { title: "TOTAL PORTFOLIO", value: totalPortfolio.toString(), icon: ImageIcon },
    { title: "FEATURED", value: totalFeatured.toString(), icon: Star },
    { title: "TOTAL ACARA", value: totalAcara.toString(), icon: Layers },
    { title: "TAHUN AKTIF", value: tahunAktif.toString(), icon: Clock },
  ];

  return (
    <div className="space-y-4">
      {/* Baris Filter Tahun Utama */}
      <div className="flex items-center justify-between bg-[#FAF8F5] border border-[#EFEBE4] px-4 py-2.5 rounded-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-[#8C7361]">
          <Calendar className="w-4 h-4 text-tbn-terracotta" />
          <span>Filter Tahun Dashboard:</span>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={loading || portfolio.length === 0}
          className="bg-[#F5F0E8] border border-[#DCD5C9] text-tbn-dark text-xs font-medium px-3 py-1.5 rounded-xs outline-none focus:border-tbn-terracotta cursor-pointer disabled:opacity-50"
        >
          <option value="ALL">Semua Tahun</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              Tahun {year}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#FAF8F5] border border-[#EFEBE4] p-4 sm:p-6 rounded-sm flex flex-col justify-between h-28 sm:h-36 shadow-xs">
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8C7361] uppercase leading-tight">
                  {stat.title}
                </span>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C7361]/60 shrink-0" />
              </div>
              <span className="font-serif text-2xl sm:text-4xl text-tbn-dark">
                {loading ? "..." : stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}