import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

interface FeaturedItem {
  id: string;
  foto: string;
  pasangan: string;
  tema: string;
  tanggal: string;
  lokasi: string;
}

const FEATURED_MAIN: FeaturedItem = {
  id: "1",
  foto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
  pasangan: "Andi & Siti",
  tema: "ELEGANT GARDEN WEDDING",
  tanggal: "15 Agustus 2026",
  lokasi: "Gedung Graha Sari",
};

const FEATURED_SIDE: FeaturedItem[] = [
  {
    id: "2",
    foto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    pasangan: "Reza & Dewi",
    tema: "INTIMATE GARDEN SOIRÉE",
    tanggal: "22 Maret 2026",
    lokasi: "Villa Puncak",
  },
  {
    id: "3",
    foto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    pasangan: "Fajar & Nadia",
    tema: "TROPICAL BEACH WEDDING",
    tanggal: "10 Juli 2026",
    lokasi: "Pantai Seminyak",
  },
];

export default function FeaturedSection() {
  return (
    <section className="bg-[#F8F5EE] py-16 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B87A5E]">
              PORTOFOLIO
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#3D2E24] sm:text-4xl lg:text-5xl">
              Pernikahan Pilihan
            </h2>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#B87A5E] transition-colors hover:text-[#A3694E]"
          >
            <span>LIHAT SEMUA PORTOFOLIO</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Featured Item (Kiri - Lebar) */}
          <div className="group cursor-pointer lg:col-span-8">
            <div className="aspect-video w-full overflow-hidden bg-[#E8DFD1]">
              <img
                src={FEATURED_MAIN.foto}
                alt={FEATURED_MAIN.pasangan}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#B87A5E]">
                {FEATURED_MAIN.tema}
              </p>
              <h3 className="mt-1 font-serif text-2xl text-[#3D2E24] sm:text-3xl">
                {FEATURED_MAIN.pasangan}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#8C7361]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#A9988B]" />
                  <span>{FEATURED_MAIN.tanggal}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#A9988B]" />
                  <span>{FEATURED_MAIN.lokasi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Featured Items (Kanan - Tumpuk Vertikal) */}
          <div className="flex flex-col gap-8 lg:col-span-4">
            {FEATURED_SIDE.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-video w-full overflow-hidden bg-[#E8DFD1] sm:aspect-4/3">
                  <img
                    src={item.foto}
                    alt={item.pasangan}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#B87A5E]">
                    {item.tema}
                  </p>
                  <h3 className="mt-1 font-serif text-xl text-[#3D2E24]">
                    {item.pasangan}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C7361]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#A9988B]" />
                      <span>{item.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#A9988B]" />
                      <span>{item.lokasi}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}