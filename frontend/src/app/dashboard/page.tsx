"use client";

import { AIExecutiveBrief } from "@/components/dashboard/AIExecutiveBrief";
import { AITipsCard } from "@/components/dashboard/AITipsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CommandCenterWidget } from "@/components/dashboard/CommandCenterWidget";
import { TodaysTasks } from "@/components/dashboard/TodaysTasks";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { KnowledgeVaultPreview } from "@/components/dashboard/KnowledgeVaultPreview";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <AIExecutiveBrief />
      <div className="mb-8">
        <CommandCenterWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Main Content (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="h-[400px]">
            <TodaysTasks />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-[250px]">
            <RecentDocuments />
            <KnowledgeVaultPreview />
          </div>
        </div>

        {/* Right Column - Secondary Content (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AITipsCard />
          <div className="flex-1">
            <QuickActions />
          </div>
          
          {/* AI Productivity Insights Mini-Widget */}
          <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-medium text-lg text-white">Productivity Insights</h2>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#00D2D3" strokeWidth="6" strokeDasharray="175" strokeDashoffset="25" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white leading-none">87</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Focus Score</p>
                <p className="text-xs text-[#A0A0A5]">Top 10% this week</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A0A0A5]">Deep Work</span>
                  <span className="text-white font-medium">3.5h / 4h</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6C5CE7] rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A0A0A5]">Completed Tasks</span>
                  <span className="text-white font-medium">4 / 7</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00B894] rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[400px]">
            <RecentActivity />
          </div>
          
        </div>
      </div>
    </div>
  );
}
