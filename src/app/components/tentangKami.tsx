import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-[#F8F5EE] py-16 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Image Container with Floating Badge */}
          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-xs bg-[#E8DFD1]">
              <img
                src="images/TBNTIM1.jpeg"
                alt="TBN Organizer Venue Decor"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Badge 8+ Years */}
            <div className="absolute -bottom-6 right-6 flex h-24 w-28 flex-col justify-center bg-[#B87A5E] p-4 text-white shadow-md sm:h-28 sm:w-32">
              <span className="font-serif text-2xl font-semibold sm:text-3xl">
                10+
              </span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest sm:text-[10px]">
                TAHUN PENGALAMAN
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="pt-6 lg:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B87A5E]">
              TENTANG KAMI
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#3D2E24] sm:text-4xl lg:text-5xl">
              Tim yang Dibangun atas Cinta & Presisi
            </h2>

            {/* Heart Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px w-12 bg-[#E8DFD1]" />
              <Heart className="h-3 w-3 fill-[#B87A5E] text-[#B87A5E]" />
              <div className="h-px w-12 bg-[#E8DFD1]" />
            </div>

            <p className="leading-relaxed text-[#6E5544] text-sm sm:text-base">
              TBN Organizer didirikan dengan satu keyakinan: bahwa setiap pasangan layak mendapatkan perayaan yang seunik kisah cinta mereka. Berbekal lebih dari delapan tahun pengalaman dan ratusan pasangan bahagia, tim kami menghadirkan ketenangan, kreativitas, dan ketelitian ekstra di setiap momen istimewa Anda.
            </p>

            <p className="mt-4 leading-relaxed text-[#6E5544] text-sm sm:text-base">
              Kami bekerja erat bersama Anda mulai dari konsultasi pertama hingga tarian terakhir, memastikan hari pernikahan Anda terwujud sempurna—bahkan melebihi apa yang Anda impikan.
            </p>

            {/* Button Link */}
            <div className="mt-8">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B87A5E] transition-colors hover:text-[#A3694E]"
              >
                <span>LIHAT PORTFOLIO</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}