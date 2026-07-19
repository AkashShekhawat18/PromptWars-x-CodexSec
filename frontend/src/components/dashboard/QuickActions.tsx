"use client";

import { Plus, PlayCircle, Mic, Users } from "lucide-react";

const actions = [
  { name: "New Note", icon: Plus, color: "text-[#00D2D3]" },
  { name: "Focus Block", icon: PlayCircle, color: "text-[#6C5CE7]" },
  { name: "Copilot", icon: Mic, color: "text-[#FF7675]" },
  { name: "Team Sync", icon: Users, color: "text-[#00B894]" },
];

export function QuickActions({ isLoading = false }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <h2 className="font-display font-medium text-lg text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              className="group flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-[#16161A]/30 hover:bg-[#16161A] transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
              <div className="w-10 h-10 rounded-lg bg-[#030303] flex items-center justify-center mb-2 border border-white/5 group-hover:scale-105 transition-transform duration-300">
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-xs font-medium text-[#A0A0A5] group-hover:text-white transition-colors">
                {action.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
