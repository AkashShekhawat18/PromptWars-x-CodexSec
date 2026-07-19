export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[420px] mx-auto p-8 sm:p-10 bg-[#0A0A0C]/60 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
