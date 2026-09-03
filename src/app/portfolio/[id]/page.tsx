"use client";

import { useState, useEffect, use } from "react";
import { Calendar, MapPin, Users, Heart, Loader2 } from "lucide-react";
import NavbarMinimal from "../../components/Navbar";
import CTASection from "../../components/ctaSection";
import Footer from "../../components/Footer";

type PortfolioDetail = {
  id: string;
  namaPengantin: string;
  subjudul?: string;
  deskripsi?: string;
  testimoni?: string;
  tanggal_acara?: {
    _seconds: number;
    _nanoseconds: number;
  };
  lokasi?: string;
  jumlahTamu?: string | number;
  tema?: string;
  gambar?: string[];
};

export default function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Unwrap promise params secara synchronous di level komponen
  const { id } = use(params);

  const [data, setData] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;

      try {
        setLoading(true);
        // Pastikan endpoint API membaca req.nextUrl.searchParams.get("id")
        const response = await fetch(`/api/portfolio?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Cek struktur response API
        const portfolioData = result.data || result;

        if (portfolioData && (portfolioData.id || portfolioData.namaPengantin)) {
          setData(portfolioData);
          if (portfolioData.gambar && portfolioData.gambar.length > 0) {
            setActiveImage(portfolioData.gambar[0]);
          }
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail portofolio:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]); // Gunakan string `id` sebagai dependency

  // Format timestamp ke tanggal Indonesia
  function formatDate(timestamp?: PortfolioDetail["tanggal_acara"]) {
    if (!timestamp?._seconds) return "-";
    return new Date(timestamp._seconds * 1000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const defaultImage =
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

  if (loading) {
    return (
      <div className="min-h-screen bg-tbn-cream flex flex-col justify-between">
        <NavbarMinimal />
        <div className="flex flex-col items-center justify-center py-32 text-tbn-dark">
          <Loader2 className="h-8 w-8 animate-spin text-tbn-terracotta mb-2" />
          <p className="text-sm">Memuat detail portofolio...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-tbn-cream flex flex-col justify-between">
        <NavbarMinimal />
        <div className="text-center py-32 text-tbn-dark">
          <h2 className="font-serif text-2xl">Portofolio tidak ditemukan</h2>
          <p className="text-sm mt-2 text-[#A9988B]">
            Data yang Anda cari mungkin telah dihapus atau tidak tersedia.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const imageList = data.gambar && data.gambar.length > 0 ? data.gambar : [defaultImage];

  return (
    <div className="min-h-screen bg-tbn-cream">
      <NavbarMinimal />

      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="relative aspect-21/9 w-full overflow-hidden bg-[#E8DFD1]">
          <img
            src={activeImage || imageList[0]}
            alt={data.namaPengantin}
            className="h-full w-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E8DFD1]">
              {data.subjudul || data.tema || "PORTFOLIO HIGHLIGHT"}
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl mt-2 font-medium">
              {data.namaPengantin}
            </h1>
          </div>
        </div>

        {imageList.length > 1 && (
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {imageList.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative h-20 w-24 shrink-0 overflow-hidden border-2 transition-all ${
                  (activeImage || imageList[0]) === imgUrl
                    ? "border-tbn-terracotta"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={imgUrl} alt="Thumbnail" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            {/* <h2 className="font-serif text-3xl text-tbn-dark">Tentang Pernikahan Ini</h2>
            <p className="text-tbn-dark leading-relaxed text-sm sm:text-base">
              {data.deskripsi || "Tidak ada deskripsi rinci untuk portofolio ini."}
            </p> */}

            {data.testimoni && (
              <div className="border-l-2 border-tbn-terracotta pl-6 py-2 bg-tbn-cream/50">
                <p className="font-serif italic text-lg text-tbn-dark">
                  &ldquo;{data.testimoni}&rdquo;
                </p>
                <p className="mt-3 text-xs tracking-wider text-tbn-dark font-semibold">
                  — {data.namaPengantin}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 border-l border-[#E8DFD1] lg:pl-12 space-y-6">
            <div className="flex items-start gap-4">
              <Calendar className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">TANGGAL</p>
                <p className="text-sm font-medium text-tbn-dark">{formatDate(data.tanggal_acara)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">LOKASI</p>
                <p className="text-sm font-medium text-tbn-dark">{data.lokasi || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Users className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">JUMLAH TAMU</p>
                <p className="text-sm font-medium text-tbn-dark">{data.jumlahTamu || "-"}</p>
              </div>
            </div>

            {/* <div className="flex items-start gap-4">
              <Heart className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">TEMA</p>
                <p className="text-sm font-medium text-tbn-dark">{data.tema || "-"}</p>
              </div>
            </div> */}
          </div>
        </div>

        {imageList.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-3xl text-tbn-dark mb-8">Galeri</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {imageList.map((imgUrl, index) => (
                <div key={index} className="aspect-4/3 overflow-hidden bg-[#E8DFD1]">
                  <img
                    src={imgUrl}
                    alt={`Galeri ${index + 1}`}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => {
                      setActiveImage(imgUrl);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <CTASection />
      <Footer />
    </div>
  );
}