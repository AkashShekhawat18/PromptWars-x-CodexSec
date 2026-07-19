"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 font-sans text-white">
      <div className="max-w-md w-full bg-[#16161A] border border-white/5 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Something went wrong</h2>
          <p className="text-[#A0A0A5] text-sm leading-relaxed">
            We encountered an unexpected error. Our engineering team has been notified.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(108,92,231,0.2)]"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all border border-white/5"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
