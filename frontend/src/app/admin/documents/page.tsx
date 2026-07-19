"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2, FileText, Trash2, ShieldAlert } from "lucide-react";

export default function AdminDocumentsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  // In a real implementation, you would have a specific API for this:
  // const res = await fetch(`/api/admin/documents?search=${search}`);
  // For the sake of the demo and brevity in this file, we'll assume the API structure.
  
  // NOTE: I am building this UI out. The backend API `/api/admin/documents` isn't created yet 
  // but it follows the exact same pattern as `/api/admin/users`.

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Document Vault Supervision</h1>
          <p className="text-sm text-[#8A8A93]">Monitor and manage user-uploaded documents across the platform.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A93]" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 mb-4">
          <FileText className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Platform Documents</h3>
        <p className="text-sm text-[#8A8A93] max-w-md">
          Document management API integration is currently pending. The schema supports viewing filename, size, owner, and status (e.g. EMBEDDED, PROCESSING).
        </p>
      </div>
    </div>
  );
}
