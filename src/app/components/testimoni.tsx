import { Star } from "lucide-react";

interface TestimonialItem {
  id: string;
  quote: string;
  pasangan: string;
  tanggal: string;
  foto: string;
  rating: number;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    quote:
      "Tim WO sangat membantu dari persiapan sampai hari acara. Semuanya terasa jauh lebih tenang dan terorganisir.",
    pasangan: "Andi & Siti",
    tanggal: "15 Agustus 2026",
    foto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "Luar biasa! Dekorasi sangat sesuai dengan konsep yang kami inginkan. Tamu-tamu sangat terpukau.",
    pasangan: "Reza & Dewi",
    tanggal: "22 Maret 2026",
    foto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "Mimpi kami menjadi kenyataan. Pernikahan di tepi pantai dengan sunset yang indah — tak terlupakan.",
    pasangan: "Fajar & Nadia",
    tanggal: "10 Juli 2026",
    foto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=150&q=80",
    rating: 5,
  },
];

export default function TestimonialsSection() {
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between border border-[#3D2C22] bg-[#2A1E17]/60 p-8 transition-colors hover:border-[#523B2E]"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#C68D75]">
                  {[...Array(item.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-3.5 w-3.5 fill-[#C68D75] text-[#C68D75]"
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="mt-6 text-sm leading-relaxed text-[#DCD5C9]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[#3D2C22]">
                  <img
                    src={item.foto}
                    alt={item.pasangan}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-base text-[#F5F0E8]">
                    {item.pasangan}
                  </h3>
                  <p className="text-xs text-[#A9988B]">{item.tanggal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}