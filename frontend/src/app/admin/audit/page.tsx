"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Loader2, AlertCircle } from "lucide-react";

export default function AdminAuditPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminAudit"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Audit Logs</h1>
        <p className="text-sm text-[#8A8A93]">Immutable record of all administrative actions taken on the platform.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#8A8A93]" /></div>
        ) : error ? (
          <div className="p-8 flex justify-center text-red-400"><AlertCircle className="w-6 h-6 mr-2" /> Error loading audit logs</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#8A8A93] uppercase bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Admin</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Target ID</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.logs?.map((log: any) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-[#8A8A93] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{log.admin?.name || log.admin?.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#8A8A93]">
                    {log.targetId || "-"}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#8A8A93] max-w-xs truncate">
                    {log.details || "-"}
                  </td>
                </tr>
              ))}
              {data?.logs?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#8A8A93]">
                    No audit logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
