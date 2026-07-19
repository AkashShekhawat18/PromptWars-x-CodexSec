import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Ghost className="h-10 w-10 text-[#A0A0A5]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-[#EAEAEA]">Page not found</h2>
          <p className="text-[#A0A0A5] text-sm leading-relaxed max-w-sm mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(108,92,231,0.2)]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
