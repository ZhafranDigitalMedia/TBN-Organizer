import Link from "next/link";
import { Heart } from "lucide-react";

export default function CTASection() {
  return (
    <section id="ctaSection" className="bg-tbn-cream py-20 px-4 sm:px-8 text-center">
      <div className="mx-auto max-w-3xl">
        {/* Subtitle */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-tbn-terracotta">
          MULAI BERSAMA KAMI
        </p>

        {/* Title */}
        <h2 className="mt-3 font-serif text-4xl text-tbn-dark sm:text-5xl lg:text-6xl">
          Rencanakan Hari Sempurna Anda
        </h2>

        {/* Heart Divider */}
        <div className="my-5 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-[#E8DFD1]" />
          <Heart className="h-3 w-3 fill-[#B87A5E] text-[#B87A5E]" />
          <div className="h-px w-12 bg-[#E8DFD1]" />
        </div>

        {/* Description */}
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#6E5544] sm:text-base">
          Ceritakan pernikahan impian Anda dan kami akan mewujudkannya. Hubungi kami untuk konsultasi awal gratis.
        </p>

        {/* CTA Buttons (2 Nomor) */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="https://wa.me/6287873170815"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-tbn-terracotta bg-tbn-terracotta px-8 py-3.5 text-xs font-normal tracking-widest text-white uppercase transition-all hover:font-bold active:font-bold hover:bg-[#A3694E]"
          >
            KONSULTASI (ADMIN 1)
          </Link>

          <Link
            href="https://wa.me/6287772092697"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-tbn-terracotta bg-transparent px-8 py-3.5 text-xs font-normal tracking-widest text-[#B87A5E] uppercase transition-all hover:font-bold active:font-bold hover:bg-[#B87A5E] hover:text-white"
          >
            KONSULTASI (ADMIN 2)
          </Link>
        </div>
      </div>
    </section>
  );
}