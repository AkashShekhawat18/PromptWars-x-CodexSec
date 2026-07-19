"use client";

import { Activity } from "lucide-react";

export default function AdminWorkflowsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Workflow Execution Logs</h1>
          <p className="text-sm text-[#8A8A93]">Monitor system-wide automated workflows and retry queues.</p>
        </div>
      </div>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <Activity className="w-12 h-12 text-teal-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Active Workflows</h3>
        <p className="text-sm text-[#8A8A93]">Users have not created any automated workflows yet.</p>
      </div>
    </div>
  );
}
