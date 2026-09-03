"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  Image as ImageIcon,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
    { label: "Tambah Portfolio", href: "/admin/portfolio/add", icon: PlusCircle },
  ];

  return (
    <>
      {/* 1. MOBILE NAVBAR (< md) */}
      <header className="block md:hidden bg-[#FAF8F5] border-b border-[#EFEBE4] px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#B87A5E] text-[#B87A5E]" />
            <span className="font-serif text-lg tracking-wide text-[#3D2E24] font-semibold">
              tbn organizer
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-[#8C7361] hover:text-[#3D2E24] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dropdown Menu Mobile */}
        {isOpen && (
          <nav className="mt-3 pt-3 border-t border-[#EFEBE4] space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F3ECE4] text-[#B87A5E]"
                      : "text-[#6E5544] hover:bg-[#F5F0E8] hover:text-[#B87A5E]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[#EFEBE4] space-y-1">
              <Link
                href="/"
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6E5544] hover:text-[#B87A5E] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Lihat Website</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6E5544] hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* 2. DESKTOP SIDEBAR (>= md) */}
      <aside className="hidden md:flex w-64 bg-[#FAF8F5] border-r border-[#EFEBE4] min-h-screen flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 pb-6 border-b border-[#EFEBE4]">
            <Heart className="w-5 h-5 fill-[#B87A5E] text-[#B87A5E]" />
            <span className="font-serif text-xl tracking-wide text-[#3D2E24] font-semibold">
              tbn organizer
            </span>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F3ECE4] text-[#B87A5E]"
                      : "text-[#6E5544] hover:bg-[#F5F0E8] hover:text-[#B87A5E]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#EFEBE4] space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6E5544] hover:text-[#B87A5E] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Lihat Website</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#6E5544] hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}