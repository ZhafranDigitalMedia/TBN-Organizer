import { Sparkles, CheckCircle2, Star, Ribbon } from "lucide-react";

interface ServiceItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "1",
    icon: Sparkles,
    title: "Perencanaan Pernikahan",
    description:
      "Perencanaan menyeluruh mulai dari konsep awal hingga eksekusi. Kami menangani setiap detail agar Anda dapat menikmati hari bahagia sepenuhnya.",
  },
  {
    id: "2",
    icon: CheckCircle2,
    title: "Koordinasi Hari H",
    description:
      "Koordinator berdedikasi memastikan setiap momen berjalan sempurna—mulai dari prosesi pertama hingga tarian penutup.",
  },
  /* {
    id: "3",
    icon: Star,
    title: "Dekorasi & Penataan Style",
    description:
      "Desain bunga kustom, pencahayaan, dan dekorasi yang mengubah tempat mana pun menjadi lokasi pernikahan impian Anda.",
  }, */
  {
    id: "4",
    icon: Ribbon,
    title: "Koordinasi Vendor",
    description:
      "Akses ke jaringan vendor terpercaya pilihan kami, mulai dari fotografer, katering, musisi, dan kebutuhan acara lainnya.",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-tbn-cream py-16 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-tbn-terracotta">
            LAYANAN KAMI
          </p>
          <h2 className="mt-3 font-serif text-3xl text-tbn-dark sm:text-4xl lg:text-5xl">
            Layanan Unggulan Kami
          </h2>
        </div>

        {/* Services Grid (Ditambahkan justify-center dan lg:grid-cols-3) */}
        <div className="grid grid-cols-1 justify-center divide-y divide-[#EFEBE4] border border-[#EFEBE4] bg-[#FAF8F5] sm:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="flex flex-col items-center text-center p-8 transition-colors hover:bg-[#F5F0E8]/50"
              >
                {/* Icon Container */}
                <div className="mb-6 flex h-10 w-10 items-center justify-center border border-[#E8DFD1] bg-[#FAF8F5] text-tbn-terracotta">
                  <IconComponent className="h-4 w-4 stroke-[1.5]" />
                </div>

                {/* Service Title */}
                <h3 className="font-serif text-xl font-medium text-tbn-dark">
                  {service.title}
                </h3>

                {/* Service Description */}
                <p className="mt-3 text-sm leading-relaxed text-[#6E5544]">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}