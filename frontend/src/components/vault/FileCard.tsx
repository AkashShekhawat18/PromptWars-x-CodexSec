"use client";

import { FileText, Image as ImageIcon, FileArchive, File, MoreVertical } from "lucide-react";
import { clsx } from "clsx";

export type FileType = "pdf" | "image" | "docx" | "ppt" | "txt";

export interface FileData {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadDate: string;
  tags?: string[];
}

interface FileCardProps {
  file?: FileData;
  isLoading?: boolean;
  onClick?: (file: FileData) => void;
}

const typeConfig = {
  pdf: { icon: FileText, color: "text-[#FF7675]", bg: "bg-[#FF7675]/10" },
  image: { icon: ImageIcon, color: "text-[#00D2D3]", bg: "bg-[#00D2D3]/10" },
  docx: { icon: File, color: "text-[#6C5CE7]", bg: "bg-[#6C5CE7]/10" },
  ppt: { icon: FileArchive, color: "text-[#fdcb6e]", bg: "bg-[#fdcb6e]/10" },
  txt: { icon: FileText, color: "text-[#A0A0A5]", bg: "bg-white/10" },
};

export function FileCard({ file, isLoading, onClick }: FileCardProps) {
  if (isLoading || !file) {
    return (
      <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] animate-pulse">
        <div className="flex items-start justify-between mb-8">
          <div className="w-10 h-10 rounded-lg bg-white/5"></div>
          <div className="w-6 h-6 rounded-md bg-white/5"></div>
        </div>
        <div className="h-5 w-3/4 bg-white/5 rounded mb-3"></div>
        <div className="h-3 w-1/2 bg-white/5 rounded"></div>
      </div>
    );
  }

  const { icon: Icon, color, bg } = typeConfig[file.type] || typeConfig.txt;

  return (
    <div 
      onClick={() => onClick?.(file)}
      className="group bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-[#16161A]/80 hover:border-white/10 hover:shadow-[0_12px_40px_rgba(108,92,231,0.1)] transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center border border-white/5", bg)}>
          <Icon className={clsx("w-5 h-5", color)} />
        </div>
        <button 
          className="p-1 rounded-md text-[#A0A0A5] opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white mb-1 line-clamp-2 group-hover:text-[#00D2D3] transition-colors">{file.name}</h4>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-[#A0A0A5]">
        <span>{file.size}</span>
        <span>{file.uploadDate}</span>
      </div>
    </div>
  );
}
