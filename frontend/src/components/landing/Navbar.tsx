"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-2xl bg-[#0A0A0C]/50 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-white to-white/20"></span>
          NeuroFlow AI
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-[#8A8A93] font-medium">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#workflows" className="hover:text-white transition-colors">Workflows</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-white font-medium hover:text-white/80 transition-colors">
            Sign In
          </Link>
          <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-medium">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
