"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Loader2 } from "lucide-react";

type PortfolioItem = {
  id: string;
  namaPengantin: string;
  tema?: string;
  tanggal_acara?: {
    _seconds: number;
    _nanoseconds: number;
  };
  lokasi_acara: string;
  gambar?: string[];
  featured?: boolean;
};

export default function FeaturedSection() {
  const [featuredItems, setFeaturedItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch("/api/portfolio");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          // Filter hanya item yang bertanda featured
          const featured = result.data.filter(
            (item: PortfolioItem) => item.featured === true
          );
          setFeaturedItems(featured);
        }
      } catch (error) {
        console.error("Gagal mengambil data featured portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  // Format tanggal Firestore timestamp ke Indonesia
  function formatDate(timestamp: PortfolioItem["tanggal_acara"]) {
    if (!timestamp?._seconds) return "-";
    return new Date(timestamp._seconds * 1000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Ambil gambar utama atau gambar default fallback
  function getImageUrl(item?: PortfolioItem) {
    if (item?.gambar && item.gambar.length > 0 && item.gambar[0].trim() !== "") {
      return item.gambar[0];
    }
    return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80";
  }

  const mainFeatured = featuredItems[0];
  const sideFeatured = featuredItems.slice(1, 3);

  return (
    <section className="bg-tbn-cream py-16 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-tbn-terracotta">
              PORTOFOLIO
            </p>
            <h2 className="mt-2 font-serif text-3xl text-tbn-dark sm:text-4xl lg:text-5xl">
              Pernikahan Pilihan
            </h2>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-tbn-terracotta transition-colors hover:text-[#A3694E]"
          >
            <span>LIHAT SEMUA PORTOFOLIO</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#8C7361]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Memuat pilihan portofolio...</span>
          </div>
        ) : !mainFeatured ? (
          <div className="py-12 text-center text-sm text-[#8C7361]">
            Belum ada portofolio pilihan yang ditampilkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Main Featured Item (Kiri - Utama) */}
            <Link
              href={`/portfolio/${mainFeatured.id}`}
              className="group cursor-pointer lg:col-span-8 block"
            >
              <div className="aspect-video w-full overflow-hidden bg-[#E8DFD1]">
                <img
                  src={getImageUrl(mainFeatured)}
                  alt={mainFeatured.namaPengantin}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="pt-6">
                {mainFeatured.tema && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-tbn-terracotta">
                    {mainFeatured.tema}
                  </p>
                )}
                <h3 className="mt-1 font-serif text-2xl text-tbn-dark sm:text-3xl transition-colors group-hover:text-tbn-terracotta">
                  {mainFeatured.namaPengantin}
                </h3>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#8C7361]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#A9988B]" />
                    <span>{formatDate(mainFeatured.tanggal_acara)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#A9988B]" />
                    <span>{mainFeatured.lokasi_acara}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Side Featured Items (Kanan - Samping) */}
            {sideFeatured.length > 0 && (
              <div className="flex flex-col gap-8 lg:col-span-4">
                {sideFeatured.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.id}`}
                    className="group cursor-pointer block"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-[#E8DFD1] sm:aspect-4/3">
                      <img
                        src={getImageUrl(item)}
                        alt={item.namaPengantin}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-4">
                      {item.tema && (
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-tbn-terracotta">
                          {item.tema}
                        </p>
                      )}
                      <h3 className="mt-1 font-serif text-xl text-tbn-dark transition-colors group-hover:text-tbn-terracotta">
                        {item.namaPengantin}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C7361]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#A9988B]" />
                          <span>{formatDate(item.tanggal_acara)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#A9988B]" />
                          <span>{item.lokasi_acara}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}