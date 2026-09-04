"use client";

import { useEffect, useState, useMemo } from "react";
import { Image as ImageIcon, Star, Layers, Clock, MapPin, Calendar } from "lucide-react";

type Portfolio = {
  id: string;
  namaPengantin: string;
  jumlah_acara: number;
  featured: boolean;
  wilayah?: string;
  tanggal_acara?: {
    _seconds: number;
    _nanoseconds: number;
  };
};

interface StatCardsProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedWilayah?: string;
  setSelectedWilayah?: (wilayah: string) => void;
}

export default function StatCards({
  selectedYear,
  setSelectedYear,
  selectedWilayah: externalWilayah,
  setSelectedWilayah: externalSetWilayah,
}: StatCardsProps) {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback state jika parent tidak mengoper prop selectedWilayah
  const [internalWilayah, setInternalWilayah] = useState("ALL");

  const selectedWilayah = externalWilayah ?? internalWilayah;
  const setSelectedWilayah = externalSetWilayah ?? setInternalWilayah;

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

  // Extraction pilihan tahun unik
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

  // Extraction pilihan wilayah unik
  const availableWilayah = useMemo(() => {
    const wilayahSet = new Set<string>();
    portfolio.forEach((item) => {
      if (item.wilayah && item.wilayah.trim() !== "") {
        wilayahSet.add(item.wilayah.trim());
      }
    });
    return Array.from(wilayahSet).sort();
  }, [portfolio]);

  // Filter data berdasarkan Tahun dan Wilayah
  const filteredPortfolio = useMemo(() => {
    return portfolio.filter((item) => {
      // Filter Tahun
      if (selectedYear !== "ALL") {
        if (!item.tanggal_acara?._seconds) return false;
        const year = new Date(item.tanggal_acara._seconds * 1000).getFullYear().toString();
        if (year !== selectedYear) return false;
      }

      // Filter Wilayah
      if (selectedWilayah !== "ALL") {
        if (item.wilayah?.trim() !== selectedWilayah) return false;
      }

      return true;
    });
  }, [portfolio, selectedYear, selectedWilayah]);

  // Total Wilayah Unik dari data terfilter
  const totalWilayahTerjangkau = useMemo(() => {
    const setWilayah = new Set<string>();
    filteredPortfolio.forEach((item) => {
      if (item.wilayah && item.wilayah.trim() !== "") {
        setWilayah.add(item.wilayah.trim());
      }
    });
    return setWilayah.size;
  }, [filteredPortfolio]);

  const totalPortfolio = filteredPortfolio.length;
  const totalFeatured = filteredPortfolio.filter((item) => item.featured === true).length;
  const totalAcara = filteredPortfolio.reduce((total, item) => total + (item.jumlah_acara || 1), 0);
  const tahunAktif = selectedYear !== "ALL" ? selectedYear : availableYears[0] || new Date().getFullYear().toString();

  return (
    <div className="space-y-4">
      {/* Baris Filter Dashboard (Tahun & Wilayah di Sebelahnya) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#FAF8F5] border border-[#EFEBE4] px-4 py-2.5 rounded-sm gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#8C7361]">
          <Calendar className="w-4 h-4 text-tbn-terracotta" />
          <span>Filter Dashboard:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Dropdown Filter Tahun */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={loading || portfolio.length === 0}
            className="bg-[#F5F0E8] border border-[#DCD5C9] text-tbn-dark text-xs font-medium px-3 py-1.5 rounded-xs outline-none focus:border-tbn-terracotta cursor-pointer disabled:opacity-50 flex-1 sm:flex-none"
          >
            <option value="ALL">Semua Tahun</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                Tahun {year}
              </option>
            ))}
          </select>

          {/* Dropdown Filter Wilayah (Di sebelah Filter Tahun) */}
          <select
            value={selectedWilayah}
            onChange={(e) => setSelectedWilayah(e.target.value)}
            disabled={loading || portfolio.length === 0}
            className="bg-[#F5F0E8] border border-[#DCD5C9] text-tbn-dark text-xs font-medium px-3 py-1.5 rounded-xs outline-none focus:border-tbn-terracotta cursor-pointer disabled:opacity-50 flex-1 sm:flex-none"
          >
            <option value="ALL">Semua Wilayah</option>
            {availableWilayah.map((wil) => (
              <option key={wil} value={wil}>
                {wil}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Statistik (5 Kotak Clean) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. TOTAL PORTFOLIO */}
        <div className="bg-[#FAF8F5] border border-[#EFEBE4] p-4 sm:p-6 rounded-sm flex flex-col justify-between h-28 sm:h-36 shadow-xs">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8C7361] uppercase leading-tight">
              TOTAL PORTFOLIO
            </span>
            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C7361]/60 shrink-0" />
          </div>
          <span className="font-serif text-2xl sm:text-4xl text-tbn-dark">
            {loading ? "..." : totalPortfolio}
          </span>
        </div>

        {/* 2. FEATURED */}
        <div className="bg-[#FAF8F5] border border-[#EFEBE4] p-4 sm:p-6 rounded-sm flex flex-col justify-between h-28 sm:h-36 shadow-xs">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8C7361] uppercase leading-tight">
              FEATURED
            </span>
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C7361]/60 shrink-0" />
          </div>
          <span className="font-serif text-2xl sm:text-4xl text-tbn-dark">
            {loading ? "..." : totalFeatured}
          </span>
        </div>

        {/* 3. TOTAL ACARA */}
        <div className="bg-[#FAF8F5] border border-[#EFEBE4] p-4 sm:p-6 rounded-sm flex flex-col justify-between h-28 sm:h-36 shadow-xs">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8C7361] uppercase leading-tight">
              TOTAL ACARA
            </span>
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C7361]/60 shrink-0" />
          </div>
          <span className="font-serif text-2xl sm:text-4xl text-tbn-dark">
            {loading ? "..." : totalAcara}
          </span>
        </div>

        {/* 4. TOTAL WILAYAH */}
        <div className="bg-[#FAF8F5] border border-[#EFEBE4] p-4 sm:p-6 rounded-sm flex flex-col justify-between h-28 sm:h-36 shadow-xs">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8C7361] uppercase leading-tight">
              WILAYAH
            </span>
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C7361]/60 shrink-0" />
          </div>
          <span className="font-serif text-2xl sm:text-4xl text-tbn-dark">
            {loading ? "..." : totalWilayahTerjangkau}
          </span>
        </div>

        {/* 5. TAHUN AKTIF */}
        <div className="bg-[#FAF8F5] border border-[#EFEBE4] p-4 sm:p-6 rounded-sm flex flex-col justify-between h-28 sm:h-36 shadow-xs">
          <div className="flex justify-between items-start gap-1">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8C7361] uppercase leading-tight">
              TAHUN AKTIF
            </span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8C7361]/60 shrink-0" />
          </div>
          <span className="font-serif text-2xl sm:text-4xl text-tbn-dark">
            {loading ? "..." : tahunAktif}
          </span>
        </div>
      </div>
    </div>
  );
}