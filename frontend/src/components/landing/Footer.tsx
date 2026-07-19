"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0A0A0C] pt-16 pb-8 px-6 z-20 relative">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-white to-white/20"></span>
              NeuroFlow
            </Link>
            <p className="text-[#8A8A93] text-sm leading-relaxed">
              Your autonomous AI productivity operating system. Automate workflows, synthesize meetings, and manage projects.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">Features</Link></li>
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">Integrations</Link></li>
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">Pricing</Link></li>
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">Documentation</Link></li>
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">API Reference</Link></li>
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">
                Twitter
              </Link>
              <Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">
                GitHub
              </Link>
              <Link href="#" className="text-[#8A8A93] hover:text-white transition-colors text-sm">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-[#8A8A93] text-sm mb-4 md:mb-0">
            © 2026 NeuroFlow AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-[#8A8A93] hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[#8A8A93] hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
