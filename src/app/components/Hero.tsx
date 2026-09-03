import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-start overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.2)), url('/images/timTBN.jpeg')`,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full py-20">
        <div className="max-w-2xl text-white">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-gray-200 uppercase mb-4">
            WEDDING ORGANIZER
          </p>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.15] mb-6 font-normal">
            We Create <br />
            Moments <span className="italic font-serif">You'll</span> <br />
            <span className="italic font-serif">Remember</span> Forever
          </h1>

          <p className="text-sm sm:text-base text-gray-200 font-light max-w-lg mb-8 leading-relaxed">
            From intimate gatherings to grand celebrations, we craft every detail
            with care, elegance, and heart.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/portfolio"
              className="bg-tbn-terracotta hover:bg-[#A3694E] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase px-8 py-4 text-center transition-colors"
            >
              LIHAT PORTFOLIO
            </Link>
            <a
              href="#ctaSection"
              className="border border-white hover:bg-white/10 text-white text-xs sm:text-sm font-semibold tracking-widest uppercase px-8 py-4 text-center transition-colors"
            >
              HUBUNGI KAMI
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}