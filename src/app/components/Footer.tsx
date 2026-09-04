"use client";

import Link from "next/link";
import { Heart, Phone, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#231812] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-16">
        <div className="grid grid-cols-1 gap-10 text-center sm:text-left md:grid-cols-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center sm:items-start md:col-span-5">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 fill-[#C68D75] text-[#C68D75]" />
              <span className="font-serif text-2xl font-semibold tracking-wide text-[#F5F0E8]">
                TBN Organizer
              </span>
            </div>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#A9988B]">
              Kami merancang perayaan yang indah dan bermakna yang akan Anda dan
              orang-orang tercinta kenang selamanya.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C68D75]">
              NAVIGASI
            </p>

            <ul className="mt-4 space-y-3 text-sm font-medium">
              <li>
                <Link
                  href="/"
                  onClick={handleScrollToTop}
                  className="inline-block py-1 text-[#F5F0E8] transition-colors hover:text-[#C68D75]"
                >
                  Beranda
                </Link>
              </li>

              <li>
                <Link
                  href="/portfolio"
                  className="inline-block py-1 text-[#F5F0E8] transition-colors hover:text-[#C68D75]"
                >
                  Portofolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C68D75]">
              KONTAK
            </p>

            <ul className="mt-4 flex flex-col items-center space-y-3 text-sm text-[#DCD5C9] sm:items-start">
              {/* Instagram */}
              <li>
                <a
                  href="https://www.instagram.com/tbnorganizer_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 py-1 transition-colors hover:text-[#C68D75]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-[#C68D75]"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>

                  <span>@tbnorganizer</span>
                </a>
              </li>

              {/* TikTok */}
              <li>
                <a
                  href="https://www.tiktok.com/@tbnorganizer_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 py-1 transition-colors hover:text-[#C68D75]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-[#C68D75]"
                    aria-hidden="true"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>

                  <span>@tbnorganizer</span>
                </a>
              </li>

              {/* Admin 1 */}
              <li>
                <a
                  href="https://wa.me/6287873170815"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 py-1 transition-colors hover:text-[#C68D75]"
                >
                  <Phone className="h-4 w-4 text-[#C68D75]" />
                  <span>+62 878-7317-0815 (Admin 1)</span>
                </a>
              </li>

              {/* Admin 2 */}
              <li>
                <a
                  href="https://wa.me/6287772092697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 py-1 transition-colors hover:text-[#C68D75]"
                >
                  <Phone className="h-4 w-4 text-[#C68D75]" />
                  <span>+62 877-7209-2697 (Admin 2)</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:tbnorganizer@gmail.com"
                  className="inline-flex items-center gap-3 py-1 transition-colors hover:text-[#C68D75]"
                >
                  <Mail className="h-4 w-4 text-[#C68D75]" />
                  <span>tbnorganizer@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Scroll to Top Button */}
        <div className="mt-10 flex justify-center sm:hidden">
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 rounded-full border border-[#3D2C22] bg-[#2A1E17] px-4 py-2 text-xs text-[#C68D75] transition-colors hover:border-[#C68D75]"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Kembali ke Atas</span>
          </button>
        </div>
      </div>

      {/* Copyright & Developer Bar */}
      <div className="border-t border-[#3D2C22] py-6 text-center text-xs text-[#8C7361]">
        <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
          <p>© 2026 TBN Organizer. All rights reserved.</p>
          <span className="hidden sm:inline">•</span>
          <p>
            Developed by{" "}
            <span className="font-semibold text-[#C68D75]">
              ZFN Project Indonesia
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}