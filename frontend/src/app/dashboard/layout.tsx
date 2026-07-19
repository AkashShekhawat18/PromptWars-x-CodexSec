import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavigation } from "@/components/dashboard/TopNavigation";
import { GlobalCommandPalette } from "@/components/dashboard/GlobalCommandPalette";
import { QuickCreateMenu } from "@/components/dashboard/QuickCreateMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#030303] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <GlobalCommandPalette />
      <QuickCreateMenu />
    </div>
  );
}
