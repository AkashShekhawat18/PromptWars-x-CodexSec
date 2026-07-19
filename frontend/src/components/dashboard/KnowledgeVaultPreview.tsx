"use client";

import { Network } from "lucide-react";

export function KnowledgeVaultPreview({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col">
        <div className="h-6 w-40 bg-white/5 rounded animate-pulse mb-6"></div>
        <div className="flex-1 bg-white/5 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="font-display font-medium text-lg text-white">Knowledge Vault</h2>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#16161A] border border-white/5 rounded-md">
          <Network className="w-3.5 h-3.5 text-[#00D2D3]" />
          <span className="text-[10px] font-mono text-[#00D2D3]">142 Nodes</span>
        </div>
      </div>

      <div className="flex-1 relative bg-[#030303] rounded-xl border border-white/5 overflow-hidden">
        {/* Conceptual Visual Representation of Node Graph */}
        <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Lines */}
            <line x1="20" y1="30" x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="80" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="60" y2="80" stroke="rgba(108,92,231,0.3)" strokeWidth="1" />
            <line x1="30" y1="70" x2="50" y2="50" stroke="rgba(0,210,211,0.3)" strokeWidth="0.5" />
            
            {/* Nodes */}
            <circle cx="20" cy="30" r="3" fill="#16161A" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="80" cy="40" r="4" fill="#16161A" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="60" cy="80" r="5" fill="#6C5CE7" className="animate-pulse" />
            <circle cx="30" cy="70" r="3" fill="#00D2D3" />
            
            {/* Center Node */}
            <circle cx="50" cy="50" r="6" fill="#0C0C0E" stroke="#00D2D3" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-3 py-1.5 bg-[#0C0C0E]/80 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg">
            <p className="text-xs text-white font-medium text-center">Project Launch</p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-[#A0A0A5] mt-4 text-center">Double-click nodes in full view to explore connections</p>
    </div>
  );
}
