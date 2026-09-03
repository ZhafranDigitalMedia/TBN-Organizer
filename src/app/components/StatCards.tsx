import { Image as ImageIcon, Star, Users, Clock } from "lucide-react";

export default function StatCards() {
  const stats = [
    { title: "TOTAL PORTFOLIO", value: "6", icon: ImageIcon },
    { title: "FEATURED", value: "3", icon: Star },
    { title: "TOTAL TAMU", value: "1.900", icon: Users },
    { title: "TAHUN AKTIF", value: "2026", icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-[#FAF8F5] border border-[#EFEBE4] p-6 rounded-sm flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-semibold tracking-wider text-[#8C7361] uppercase">
                {stat.title}
              </span>
              <Icon className="w-4 h-4 text-[#8C7361]/60" />
            </div>
            <span className="font-serif text-4xl text-[#3D2E24]">{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
}