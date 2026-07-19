"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, FileText, Cpu, Database, Activity, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-400">
        <AlertTriangle className="w-6 h-6 mr-2" />
        Failed to load dashboard data. Ensure you have admin privileges.
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Pending Verifications", value: stats?.pendingVerifications || 0, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Active Users", value: stats?.activeUsers || 0, icon: Activity, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Suspended", value: stats?.suspendedUsers || 0, icon: Users, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Documents", value: stats?.uploadedDocuments || 0, icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Storage Used (Bytes)", value: stats?.storageUsage || 0, icon: Database, color: "text-pink-400", bg: "bg-pink-500/10" },
    { label: "AI Requests Today", value: stats?.aiRequestsToday || 0, icon: Cpu, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Workflows Created", value: stats?.workflowsCreated || 0, icon: Activity, color: "text-teal-400", bg: "bg-teal-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Admin Overview</h1>
        <p className="text-[#8A8A93]">System health and platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className={clsx("w-24 h-24", stat.color)} />
              </div>
              <div className="relative z-10">
                <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center mb-4", stat.bg)}>
                  <Icon className={clsx("w-5 h-5", stat.color)} />
                </div>
                <h3 className="text-[#8A8A93] font-medium text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
