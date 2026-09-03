import Image from "next/image";
import { Eye, Edit3, Trash2 } from "lucide-react";

const projects = [
  {
    id: 1,
    image: "/images/wedding1.jpg",
    title: "Andi & Siti",
    subtitle: "Elegant Garden Wedding",
    date: "15 Agustus 2026",
    location: "Gedung Graha Sari",
    guests: 500,
    featured: true,
  },
  {
    id: 2,
    image: "/images/wedding2.jpg",
    title: "Reza & Dewi",
    subtitle: "Intimate Garden Soirée",
    date: "22 Maret 2026",
    location: "Villa Puncak",
    guests: 120,
    featured: true,
  },
  {
    id: 3,
    image: "/images/wedding3.jpg",
    title: "Budi & Ayu",
    subtitle: "Classic Black & Gold",
    date: "5 Mei 2026",
    location: "Hotel Mulia",
    guests: 300,
    featured: false,
  },
];

export default function RecentProjectsTable() {
  return (
    <div className="bg-[#FAF8F5] border border-[#EFEBE4] rounded-sm overflow-hidden">
      <div className="p-6 border-b border-[#EFEBE4]">
        <h2 className="font-serif text-xl text-[#3D2E24]">Proyek Terbaru</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EFEBE4] text-[11px] uppercase tracking-wider text-[#8C7361]">
              <th className="py-4 px-6 font-semibold">FOTO</th>
              <th className="py-4 px-6 font-semibold">PASANGAN</th>
              <th className="py-4 px-6 font-semibold">TANGGAL</th>
              <th className="py-4 px-6 font-semibold">LOKASI</th>
              <th className="py-4 px-6 font-semibold">TAMU</th>
              <th className="py-4 px-6 font-semibold">FEATURED</th>
              <th className="py-4 px-6 font-semibold">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEBE4] text-sm text-[#6E5544]">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-[#F5F0E8]/40 transition-colors">
                <td className="py-4 px-6">
                  <div className="w-14 h-14 relative bg-gray-200 overflow-hidden rounded-sm">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="font-serif text-base text-[#3D2E24] font-medium">
                    {project.title}
                  </p>
                  <p className="text-xs text-[#8C7361]">{project.subtitle}</p>
                </td>
                <td className="py-4 px-6 text-xs">{project.date}</td>
                <td className="py-4 px-6 text-xs">{project.location}</td>
                <td className="py-4 px-6 text-xs">{project.guests}</td>
                <td className="py-4 px-6">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase rounded-xs ${
                      project.featured
                        ? "bg-[#F0E6DD] text-[#B87A5E]"
                        : "bg-[#EAE4DC] text-[#8C7361]"
                    }`}
                  >
                    {project.featured ? "YA" : "TIDAK"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3 text-[#8C7361]">
                    <button className="hover:text-[#B87A5E] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="hover:text-[#B87A5E] transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}