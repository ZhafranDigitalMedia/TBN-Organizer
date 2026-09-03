"use client";

import Navbar from "../app/components/Navbar";
import Hero from "../app/components/Hero";
import TentangKami from "../app/components/tentangKami";
import LayananKami from "../app/components/layananKami";
import PortofolioUnggulan from "../app/components/portofolioUnggulan";
import Testimoni from "../app/components/testimoni";
import CTASection from "./components/ctaSection";
import Footer from "./components/Footer";
/* import { auth } from "../../../lib/firebase/client"; */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F5EE]">
      <Navbar />
      <Hero />
      <TentangKami />
      <LayananKami />
      <PortofolioUnggulan />
      <Testimoni />
      <CTASection />
      <Footer />
    </main>
  );
}