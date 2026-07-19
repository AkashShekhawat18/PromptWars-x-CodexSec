"use client";

import { FileText, PenTool, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { documentsAPI } from "@/lib/api";

const typeConfig = {
  pdf: { icon: FileText, color: "text-[#FF7675]" },
  image: { icon: PenTool, color: "text-[#00D2D3]" },
  docx: { icon: FileText, color: "text-[#6C5CE7]" },
  ppt: { icon: PenTool, color: "text-[#fdcb6e]" },
  txt: { icon: FileText, color: "text-[#A0A0A5]" },
};

export function RecentDocuments({ isLoading: externalLoading }: { isLoading?: boolean }) {
  const { data: docs = [], isLoading: isQueryLoading, isError, refetch } = useQuery({
    queryKey: ["documents", "recent"],
    queryFn: documentsAPI.getDocuments,
  });

  const isLoading = externalLoading || isQueryLoading;

  if (isLoading) {
    return (
      <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-medium text-lg text-white">Recent Vault Activity</h2>
        </div>
        <div className="flex-1 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-lg animate-pulse shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-white/5 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col items-center justify-center text-center">
        <p className="text-red-400 mb-2">Failed to load documents</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-medium text-lg text-white">Recent Context</h2>
        <span className="text-xs font-medium text-[#6C5CE7] hover:text-white cursor-pointer transition-colors">View All</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {docs.length === 0 ? (
          <div className="text-sm text-[#A0A0A5] text-center pt-4">Upload a document to build your knowledge vault.</div>
        ) : (
          docs.map(doc => {
            const config = typeConfig[doc.type as keyof typeof typeConfig] || typeConfig.txt;
            const Icon = config.icon;
            return (
              <div 
                key={doc.id}
                className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#16161A] flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate group-hover:text-[#00D2D3] transition-colors">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-[#A0A0A5]" />
                    <span className="text-[11px] text-[#A0A0A5]">{doc.uploadDate}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
