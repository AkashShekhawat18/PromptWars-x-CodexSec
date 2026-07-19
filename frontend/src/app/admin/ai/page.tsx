"use client";

import { Cpu } from "lucide-react";

export default function AdminAIPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">AI Monitoring & Usage</h1>
          <p className="text-sm text-[#8A8A93]">Track Gemini token usage, prompt history, and rate limits.</p>
        </div>
      </div>
      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <Cpu className="w-12 h-12 text-purple-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No AI Data Available</h3>
        <p className="text-sm text-[#8A8A93]">AI usage metrics will populate here once users begin interacting with Gemini.</p>
      </div>
    </div>
  );
}
