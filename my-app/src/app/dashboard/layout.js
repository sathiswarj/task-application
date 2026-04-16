import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
