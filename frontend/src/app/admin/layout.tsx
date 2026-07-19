import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#030303] text-white overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 bg-[#050505] flex items-center px-6 justify-between flex-shrink-0">
          <h2 className="text-sm font-medium text-[#8A8A93]">Enterprise Admin Console</h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">SA</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#030303] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
