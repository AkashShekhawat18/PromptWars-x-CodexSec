"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, Image as ImageIcon, FileArchive, File, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

export function UploadArea() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    // Simulate upload process
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 2000);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }, 2000);
    }
  };

  return (
    <div 
      className={clsx(
        "relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center p-10 min-h-[200px]",
        isDragging 
          ? "border-[#6C5CE7] bg-[#6C5CE7]/5 shadow-[0_0_30px_rgba(108,92,231,0.15)]" 
          : "border-white/10 hover:border-white/20 bg-[#0C0C0E]/50"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        multiple 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        onChange={handleFileInput}
        disabled={isUploading || isSuccess}
        accept=".pdf,image/*,.docx,.ppt,.pptx,.txt"
      />

      <div className="flex flex-col items-center text-center z-0">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#00B894]/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#00B894]" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Upload Complete</h3>
            <p className="text-sm text-[#A0A0A5]">Files have been securely stored in the Vault.</p>
          </>
        ) : isUploading ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center mb-4 relative">
              <svg className="w-16 h-16 absolute inset-0 text-[#6C5CE7] animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="140" strokeLinecap="round" />
              </svg>
              <UploadCloud className="w-6 h-6 text-[#6C5CE7] animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Encrypting & Uploading...</h3>
            <p className="text-sm text-[#A0A0A5]">Please wait while we index your files.</p>
          </>
        ) : (
          <>
            <div className={clsx(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300",
              isDragging ? "bg-[#6C5CE7]/20 text-[#6C5CE7]" : "bg-white/5 text-[#A0A0A5]"
            )}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Drag & Drop files here</h3>
            <p className="text-sm text-[#A0A0A5] mb-6">or click to browse from your computer</p>
            
            <div className="flex items-center gap-4 text-xs font-medium text-[#A0A0A5]">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> PDF</span>
              <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Images</span>
              <span className="flex items-center gap-1.5"><FileArchive className="w-3.5 h-3.5" /> DOCX/PPT</span>
              <span className="flex items-center gap-1.5"><File className="w-3.5 h-3.5" /> TXT</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
