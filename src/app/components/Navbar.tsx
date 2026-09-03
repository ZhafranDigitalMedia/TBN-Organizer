"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Helper untuk mengecek status aktif
  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full bg-[#F5F0E8] border-b border-[#E8DFD1]/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Heart className="w-5 h-5 fill-tbn-terracotta text-tbn-terracotta" />
          <span className="font-serif text-2xl tracking-wide text-tbn-dark font-semibold">
            TBN Organizer
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-xs tracking-widest uppercase transition-colors ${
              isActive("/")
                ? "text-tbn-terracotta font-bold"
                : "text-[#6E5544] font-semibold hover:text-tbn-terracotta"
            }`}
          >
            BERANDA
          </Link>

          <Link
            href="/portfolio"
            className={`text-xs tracking-widest uppercase transition-colors ${
              isActive("/portfolio")
                ? "text-tbn-terracotta font-bold"
                : "text-[#6E5544] font-semibold hover:text-tbn-terracotta"
            }`}
          >
            PORTFOLIO
          </Link>

          <Link
            href="/admin/login"
            className="bg-tbn-terracotta hover:bg-[#A3694E] text-white text-xs font-semibold tracking-widest uppercase px-6 py-2.5 transition-colors"
          >
            ADMIN
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#6E5544] p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F5F0E8] border-b border-[#E8DFD1] px-4 pt-2 pb-6 space-y-4 flex flex-col items-center text-center">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`text-xs tracking-widest uppercase py-2 w-full ${
              isActive("/")
                ? "text-tbn-terracotta font-bold"
                : "text-[#6E5544] font-semibold"
            }`}
          >
            BERANDA
          </Link>

          <Link
            href="/portfolio"
            onClick={() => setIsOpen(false)}
            className={`text-xs tracking-widest uppercase py-2 w-full ${
              isActive("/portfolio")
                ? "text-tbn-terracotta font-bold"
                : "text-[#6E5544] font-semibold"
            }`}
          >
            PORTFOLIO
          </Link>

          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="bg-tbn-terracotta text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 w-full max-w-xs transition-colors"
          >
            ADMIN
          </Link>
        </div>
      )}
    </header>
  );
}