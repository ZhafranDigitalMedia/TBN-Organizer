import Sidebar from "../../../components/Sidebar";
import AddPortfolioForm from "../../../components/AddPortfolioForm";

export default function AddPortfolioPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F5EE]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <AddPortfolioForm />
      </main>
    </div>
  );
}