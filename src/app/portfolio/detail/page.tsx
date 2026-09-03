"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import NavbarMinimal from "../../components/Navbar";
import CTASection from "../../components/ctaSection";
import Footer from "../../components/Footer";

// Dummy data detail pernikahan
const WEDDING_DETAIL = {
  id: "1",
  title: "Andi & Siti",
  subtitle: "ELEGANT GARDEN WEDDING",
  description:
    "Pernikahan taman yang memukau di tengah pepohonan hijau yang rindang dan pencahayaan lilin yang hangat. Setiap detail—mulai dari gerbang bunga hingga penataan meja—dikurasi khusus untuk mencerminkan indah kisah cinta pasangan ini.",
  quote:
    "Tim WO sangat membantu dari persiapan sampai hari acara. Semuanya terasa jauh lebih tenang dan terorganisir.",
  date: "15 Agustus 2026",
  location: "Gedung Graha Sari, Jakarta",
  guests: "500 orang",
  theme: "Elegant Garden Wedding",
  images: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80",
  ],
};

export default function PortfolioDetailPage() {
  const [activeImage, setActiveImage] = useState(WEDDING_DETAIL.images[0]);

  return (
    <div className="min-h-screen bg-tbn-cream">
      {/* Navbar Minimalis Detail */}
      <NavbarMinimal />

      {/* Hero Showcase Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="relative aspect-21/9 w-full overflow-hidden bg-[#E8DFD1]">
          <img
            src={activeImage}
            alt={WEDDING_DETAIL.title}
            className="h-full w-full object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#E8DFD1]">
              {WEDDING_DETAIL.subtitle}
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl mt-2 font-medium">
              {WEDDING_DETAIL.title}
            </h1>
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
          {WEDDING_DETAIL.images.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(imgUrl)}
              className={`relative h-20 w-24 shrink-0 overflow-hidden border-2 transition-all ${
                activeImage === imgUrl ? "border-tbn-terracotta" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={imgUrl} alt="Thumbnail" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Information & Details Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content & Quote (Kiri) */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="font-serif text-3xl text-tbn-dark">Tentang Pernikahan Ini</h2>
            <p className="text-tbn-dark leading-relaxed text-sm sm:text-base">
              {WEDDING_DETAIL.description}
            </p>

            {/* Testimonial Quote */}
            <div className="border-l-2 border-tbn-terracotta pl-6 py-2 bg-tbn-cream/50">
              <p className="font-serif italic text-lg text-tbn-dark">
                &ldquo;{WEDDING_DETAIL.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs tracking-wider text-tbn-dark font-semibold">
                — {WEDDING_DETAIL.title}
              </p>
            </div>
          </div>

          {/* Quick Info Sidebar (Kanan) */}
          <div className="lg:col-span-5 border-l border-[#E8DFD1] lg:pl-12 space-y-6">
            <div className="flex items-start gap-4">
              <Calendar className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">TANGGAL</p>
                <p className="text-sm font-medium text-tbn-dark">{WEDDING_DETAIL.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">LOKASI</p>
                <p className="text-sm font-medium text-tbn-dark">{WEDDING_DETAIL.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Users className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">JUMLAH TAMU</p>
                <p className="text-sm font-medium text-tbn-dark">{WEDDING_DETAIL.guests}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Heart className="h-5 w-5 text-tbn-terracotta mt-1 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#A9988B] uppercase">TEMA</p>
                <p className="text-sm font-medium text-tbn-dark">{WEDDING_DETAIL.theme}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-20">
          <h2 className="font-serif text-3xl text-tbn-dark mb-8">Galeri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WEDDING_DETAIL.images.map((imgUrl, index) => (
              <div key={index} className="aspect-4/3 overflow-hidden bg-[#E8DFD1]">
                <img
                  src={imgUrl}
                  alt={`Galeri ${index + 1}`}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setActiveImage(imgUrl)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
      <Footer />
    </div>
  );
}