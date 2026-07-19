import { Logo } from "@/components/auth/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0C] p-4 sm:p-8 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/[0.015] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-[420px] relative z-10">
        <Logo />
        {children}
      </div>
    </div>
  );
}
