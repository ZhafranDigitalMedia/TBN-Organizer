"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Daftar gambar latar belakang pernikahan berkualitas tinggi
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85",
    alt: "Elegance Wedding Setting",
  },
  {
    url: "/images/TBNTIM1.jpeg",
    alt: "Wedding Ceremony Moment",
  },
  {
    url: "/images/timTBN.jpeg",
    alt: "Tim TBN Wedding Organizer",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=85",
    alt: "Romantic Bride and Groom",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efek ganti gambar otomatis setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-start overflow-hidden bg-black">
      {/* Background Slideshow dengan Smooth Transition */}
      {heroImages.map((img, index) => (
        <div
          key={img.url}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url('${img.url}')`,
            transitionProperty: "opacity, transform",
            transitionDuration: "1200ms, 6000ms", // Transisi pudar dan zoom perlahan
          }}
        />
      ))}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full py-20">
        <div className="max-w-2xl text-white">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-gray-200 uppercase mb-4 drop-shadow-sm">
            WEDDING ORGANIZER
          </p>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.15] mb-6 font-normal drop-shadow-md">
            We Create <br />
            Moments <span className="italic font-serif">You'll</span> <br />
            <span className="italic font-serif">Remember</span> Forever
          </h1>

          <p className="text-sm sm:text-base text-gray-200 font-light max-w-lg mb-8 leading-relaxed drop-shadow-sm">
            From intimate gatherings to grand celebrations, we craft every detail
            with care, elegance, and heart.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/portfolio"
              className="bg-tbn-terracotta hover:bg-[#A3694E] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase px-8 py-4 text-center transition-colors shadow-lg"
            >
              LIHAT PORTFOLIO
            </Link>
            <a
              href="#ctaSection"
              className="border border-white/80 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold tracking-widest uppercase px-8 py-4 text-center transition-colors backdrop-blur-xs"
            >
              HUBUNGI KAMI
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Kiri & Kanan) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 p-2.5 rounded-full backdrop-blur-sm transition-all hidden sm:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 p-2.5 rounded-full backdrop-blur-sm transition-all hidden sm:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators (Titik Navigasi Bawah) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-tbn-terracotta"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}