"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import StatCards from "../../components/StatCards";
import RecentProjectsTable from "../../components/RecentProjectsTable";

export default function DashboardPage() {
  // State terpusat untuk filter tahun
  const [selectedYear, setSelectedYear] = useState<string>("ALL");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-tbn-cream">
      {/* Di mobile jadi Top Navbar, di desktop jadi Sidebar Kiri */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto space-y-6 sm:space-y-8">
        {/* Header dengan Tombol Tambah Portfolio */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-tbn-dark">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#8C7361] mt-1">
              Ringkasan performa dan daftar portofolio terbaru.
            </p>
          </div>

          <Link
            href="/admin/portfolio/add"
            className="inline-flex items-center justify-center gap-2 bg-tbn-terracotta px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#A3694E] rounded-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tambah Portfolio
          </Link>
        </div>

        {/* Statistik ringkasan (Menerima state & pengubah state) */}
        <StatCards 
          selectedYear={selectedYear} 
          setSelectedYear={setSelectedYear} 
        />

        {/* Tabel / Card data proyek (Menerima state tahun aktif) */}
        <RecentProjectsTable 
          selectedYear={selectedYear} 
        />
      </main>
    </div>
  );
}