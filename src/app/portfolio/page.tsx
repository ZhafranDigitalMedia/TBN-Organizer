import Navbar from "../components/Navbar";
import Portfolio from "../components/portfolio";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EE]">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Portfolio />
      </main>
    </div>
  );
}