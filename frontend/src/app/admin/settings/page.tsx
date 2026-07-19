"use client";

import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">System Settings</h1>
          <p className="text-sm text-[#8A8A93]">Configure global variables, maintenance mode, and security policies.</p>
        </div>
      </div>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-8">
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Maintenance Mode</h3>
              <p className="text-xs text-[#8A8A93] mt-1">Disables all non-admin access to the platform.</p>
            </div>
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Auto-Approve Signups</h3>
              <p className="text-xs text-[#8A8A93] mt-1">Bypass manual verification for new users.</p>
            </div>
            <button className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-sm font-medium text-white">Clear Cache</h3>
              <p className="text-xs text-[#8A8A93] mt-1">Purge Redis cache and force revalidation of static assets.</p>
            </div>
            <button className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
              Purge All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
