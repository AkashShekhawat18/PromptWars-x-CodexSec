"use client";

import { X, Download, Trash2, Share2, FileText, Tag as TagIcon, Clock, Database } from "lucide-react";
import { FileData } from "./FileCard";
import { clsx } from "clsx";
import { useEffect, useState } from "react";

interface DocumentDetailsSheetProps {
  file: FileData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentDetailsSheet({ file, isOpen, onClose }: DocumentDetailsSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState<{ summary: string; keyPoints?: string[] } | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Reset summary state when a new file is selected
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSummaryData(null);
     
    setSummaryError(null);
  }, [file?.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div 
        className={clsx(
          "fixed top-0 right-0 h-full w-full max-w-md bg-[#0C0C0E]/95 backdrop-blur-2xl border-l border-white/10 z-50 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.1)] flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-display font-medium text-white">Document Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-[#A0A0A5] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {file ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-40 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/10 to-transparent"></div>
                <FileText className="w-12 h-12 text-[#6C5CE7]" />
              </div>
            </div>

            <h3 className="text-xl font-medium text-white mb-2 text-center">{file.name}</h3>
            <p className="text-sm text-[#A0A0A5] text-center mb-8">{file.size} • Uploaded {file.uploadDate}</p>

            <div className="flex items-center justify-center gap-3 mb-8">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#6C5CE7] hover:bg-[#5a4cdb] text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(108,92,231,0.3)]">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/5">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>AI Analysis</span>
                  <button 
                    onClick={async () => {
                      if (!file) return;
                      setIsSummarizing(true);
                      setSummaryError(null);
                      try {
                        const res = await fetch("/api/ai/summarize", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ content: `Content for ${file.name}` }) // In a real app we'd send actual content
                        });
                        if (!res.ok) throw new Error("Failed to summarize");
                        const data = await res.json();
                        setSummaryData(data);
                      } catch (_err) {
                        setSummaryError("Failed to generate AI summary.");
                      } finally {
                        setIsSummarizing(false);
                      }
                    }}
                    disabled={isSummarizing || !!summaryData}
                    className="text-[10px] bg-[#6C5CE7]/20 hover:bg-[#6C5CE7]/40 text-[#6C5CE7] px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSummarizing ? "Analyzing..." : summaryData ? "Analyzed" : "Generate Analysis"}
                  </button>
                </h4>
                <div className="p-4 rounded-xl bg-[#16161A]/50 border border-white/5 text-sm text-white/80 leading-relaxed space-y-3">
                  {summaryError ? (
                    <span className="text-red-400">{summaryError}</span>
                  ) : summaryData ? (
                    <>
                      <p>{summaryData.summary}</p>
                      {(summaryData.keyPoints?.length ?? 0) > 0 && (
                        <div>
                          <strong className="text-white text-xs uppercase tracking-wider">Key Points</strong>
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            {summaryData.keyPoints?.map((kp: string, i: number) => <li key={i}>{kp}</li>)}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-[#A0A0A5] italic">Click &apos;Generate Analysis&apos; to synthesize this document.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wider mb-3">Metadata</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Database className="w-4 h-4 text-[#00D2D3]" />
                    <span className="text-[#A0A0A5] w-24">Vector ID</span>
                    <span className="text-white font-mono">idx_98x4f2a</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-[#00B894]" />
                    <span className="text-[#A0A0A5] w-24">Last synced</span>
                    <span className="text-white">Just now</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TagIcon className="w-3.5 h-3.5" /> Semantic Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {file.tags?.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/90">
                      {tag}
                    </span>
                  ))}
                  {(!file.tags || file.tags.length === 0) && (
                    <span className="text-sm text-[#A0A0A5]">No tags generated yet.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-[#A0A0A5]">No document selected</p>
          </div>
        )}
      </div>
    </>
  );
}
