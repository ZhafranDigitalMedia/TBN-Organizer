import Sidebar from "../../../components/Sidebar";
import AddPortfolioForm from "../../../components/AddPortfolioForm";

export default function AddPortfolioPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F5EE]">
      {/* Top Navbar di mobile, Sidebar Kiri di desktop */}
      <Sidebar />

      {/* Main Content dengan padding yang pas di layar HP */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <AddPortfolioForm />
      </main>
    </div>
  );
}