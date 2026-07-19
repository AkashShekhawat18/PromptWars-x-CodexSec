"use client";

import { useState } from "react";
import { UploadArea } from "@/components/vault/UploadArea";
import { VaultSearch } from "@/components/vault/VaultSearch";
import { FileCard } from "@/components/vault/FileCard";
import { EmptyState } from "@/components/vault/EmptyState";
import { DocumentDetailsSheet } from "@/components/vault/DocumentDetailsSheet";
import { useQuery } from "@tanstack/react-query";
import { documentsAPI, Document } from "@/lib/api";

export default function VaultPage() {
  const [selectedFile, setSelectedFile] = useState<Document | null>(null);

  const { data: files = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: documentsAPI.getDocuments,
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full flex flex-col min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-white tracking-tight mb-1">Knowledge Vault</h1>
          <p className="text-sm text-[#A0A0A5]">Manage and query your unified workspace intelligence.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-3 py-1.5 text-xs font-medium text-[#A0A0A5] bg-white/5 hover:bg-white/10 rounded-md transition-colors"
        >
          Refresh Vault
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Left Column - Upload Area (1 col) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="text-sm font-medium text-white mb-4">Add to Vault</h2>
            <UploadArea />
          </div>
          
          <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h2 className="text-sm font-medium text-white mb-4">Vault Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A0A0A5]">Storage Used</span>
                  <span className="text-white font-medium">1.2 GB / 5 GB</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00D2D3] rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-[#A0A0A5] mb-1">Total Nodes</p>
                  <p className="text-lg font-medium text-white">3,492</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-xs text-[#A0A0A5] mb-1">Connections</p>
                  <p className="text-lg font-medium text-white">12,840</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - File Repository (2 cols) */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="mb-6">
            <VaultSearch />
          </div>

          <div className="flex-1 bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-h-[400px]">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <FileCard key={i} isLoading={true} />)}
              </div>
            ) : isError ? (
              <div className="h-full flex flex-col items-center justify-center">
                <p className="text-red-400 mb-4 text-center">Failed to connect to the backend API.<br/>Please ensure the server is running.</p>
                <button onClick={() => refetch()} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors text-white">Retry Connection</button>
              </div>
            ) : files.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <EmptyState />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {files.map(file => (
                  <FileCard 
                    key={file.id} 
                    file={file} 
                    onClick={(f) => setSelectedFile(f)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DocumentDetailsSheet 
        file={selectedFile} 
        isOpen={!!selectedFile} 
        onClose={() => setSelectedFile(null)} 
      />
    </div>
  );
}
