import Link from "next/link";
import { Heart, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#231812] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 fill-[#C68D75] text-[#C68D75]" />

              <span className="font-serif text-2xl font-semibold tracking-wide text-[#F5F0E8]">
                TBN Organizer
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#A9988B]">
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
              {/*  <li>
                <Link
                  href="/"
                  className="text-[#F5F0E8] transition-colors hover:text-[#C68D75]"
                >
                  Beranda
                </Link>
              </li> */}

              <li>
                <Link
                  href="/portfolio"
                  className="text-[#F5F0E8] transition-colors hover:text-[#C68D75]"
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

            <ul className="mt-4 space-y-3 text-sm text-[#DCD5C9]">
              {/* Instagram */}
              <li>
                <a
                  href="https://www.instagram.com/tbnorganizer_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-[#C68D75]"
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

              <li>
                <a
                  href="https://wa.me/6287873170815"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-[#C68D75]"
                >
                  <Phone className="h-4 w-4 text-[#C68D75]" />
                  <span>+62 878-7317-0815(admin 1)</span>
                </a>
              </li>
              {/* Phone */}
              <li>
                <a
                  href="https://wa.me/6287772092697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-[#C68D75]"
                >
                  <Phone className="h-4 w-4 text-[#C68D75]" />
                  <span>+62 877-7209-2697(admin 2)</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:tbnorganizer@gmail.com"
                  className="inline-flex items-center gap-3 transition-colors hover:text-[#C68D75]"
                >
                  <Mail className="h-4 w-4 text-[#C68D75]" />
                  <span>tbnorganizer@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#3D2C22] py-6 text-center text-xs text-[#8C7361]">
        <p>© 2026 TBN Organizer. All rights reserved.</p>
      </div>
    </footer>
  );
}
