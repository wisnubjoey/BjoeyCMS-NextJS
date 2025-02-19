import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { SessionNavBar } from '@/components/ui/sidebar';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-row">
      <Sidebar />
      <main className="flex h-screen grow flex-col overflow-auto">
        <Header />
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}