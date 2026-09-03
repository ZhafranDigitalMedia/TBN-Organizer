"use client";

import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";

type PortfolioItem = {
  id: string;
  namaPengantin: string;
  testimoni?: string;
  rating?: number;
  tanggal_acara?: {
    _seconds: number;
    _nanoseconds: number;
  };
  gambar?: string[];
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch("/api/portfolio");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          // Filter portofolio yang memiliki field testimoni
          const withTestimonials = result.data.filter(
            (item: PortfolioItem) =>
              item.testimoni && item.testimoni.trim() !== ""
          );
          setTestimonials(withTestimonials);
        }
      } catch (error) {
        console.error("Gagal mengambil data testimoni:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Format timestamp ke tanggal Indonesia
  function formatDate(timestamp: PortfolioItem["tanggal_acara"]) {
    if (!timestamp?._seconds) return "-";
    return new Date(timestamp._seconds * 1000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Ambil foto pengantin atau fallback gambar default
  function getPhotoUrl(item: PortfolioItem) {
    if (item.gambar && item.gambar.length > 0 && item.gambar[0].trim() !== "") {
      return item.gambar[0];
    }
    return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80";
  }

  return (
    <section className="bg-[#231812] py-20 px-4 sm:px-8 lg:px-16 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-14 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C68D75]">
            TESTIMONI
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[#F5F0E8] sm:text-4xl lg:text-5xl">
            Kisah dari Pasangan Bahagia
          </h2>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#A9988B]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Memuat testimoni...</span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#A9988B]">
            Belum ada testimoni yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((item) => {
              const ratingCount = item.rating || 5;

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between border border-[#3D2C22] bg-[#2A1E17]/60 p-8 transition-colors hover:border-[#523B2E]"
                >
                  <div>
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 text-[#C68D75]">
                      {[...Array(ratingCount)].map((_, index) => (
                        <Star
                          key={index}
                          className="h-3.5 w-3.5 fill-[#C68D75] text-[#C68D75]"
                        />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <p className="mt-6 text-sm leading-relaxed text-[#DCD5C9]">
                      &ldquo;{item.testimoni}&rdquo;
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="mt-8 flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-[#3D2C22]">
                      <img
                        src={getPhotoUrl(item)}
                        alt={item.namaPengantin}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-[#F5F0E8]">
                        {item.namaPengantin}
                      </h3>
                      <p className="text-xs text-[#A9988B]">
                        {formatDate(item.tanggal_acara)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}