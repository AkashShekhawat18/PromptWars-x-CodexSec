"use client";

import { Database } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#00D2D3]/10 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-16 h-16 rounded-2xl bg-[#16161A] border border-white/10 flex items-center justify-center shadow-2xl">
          <Database className="w-8 h-8 text-[#00D2D3]" />
        </div>
      </div>
      <h3 className="text-xl font-display font-medium text-white mb-2">Your Vault is Empty</h3>
      <p className="text-[#A0A0A5] max-w-sm mx-auto mb-8 leading-relaxed">
        Upload your first document to initialize the Knowledge Graph. NeuroFlow AI will automatically extract concepts, index the text, and prepare it for semantic search.
      </p>
    </div>
  );
}
