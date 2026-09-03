import Sidebar from "../../components/Sidebar";
import StatCards from "../../components/StatCards";
import RecentProjectsTable from "../../components/RecentProjectsTable";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#F8F5EE]">
      <Sidebar />
      <main className="flex-1 p-8 sm:p-10 overflow-y-auto">
        <h1 className="font-serif text-3xl text-[#3D2E24] mb-8">Dashboard</h1>
        <StatCards />
        <RecentProjectsTable />
      </main>
    </div>
  );
}