"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Network, 
  Workflow, 
  History, 
  Blocks, 
  Play, 
  Pause,
  CheckCircle2,
  Settings2,
  Plus,
  Loader2,
  AlertCircle,
  FileText,
  MessageSquare,
  Mail,
  MoreVertical
} from "lucide-react";
import { clsx } from "clsx";

type TabType = "dashboard" | "builder" | "history" | "templates";

interface WorkflowItem {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  lastRun?: string;
  runs: number;
}

const MOCK_WORKFLOWS: WorkflowItem[] = [
  { id: "1", name: "Daily Standup Synthesis", status: "active", lastRun: "10 mins ago", runs: 45 },
  { id: "2", name: "Invoice Processor", status: "active", lastRun: "2 hours ago", runs: 128 },
  { id: "3", name: "Client Onboarding", status: "paused", lastRun: "3 days ago", runs: 12 },
  { id: "4", name: "Weekly Report Gen", status: "draft", runs: 0 },
];

const MOCK_TEMPLATES = [
  { id: "t1", name: "Meeting Summarizer", desc: "Extracts action items from transcripts and sends to Slack." },
  { id: "t2", name: "Customer Support AI", desc: "Auto-drafts responses based on Knowledge Vault data." },
  { id: "t3", name: "Lead Enrichment", desc: "Pulls LinkedIn data and updates CRM contacts." },
];

export function WorkflowEngine() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWorkflows(MOCK_WORKFLOWS);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAISuggestion = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setWorkflows([
        { id: "ai1", name: "Automated PR Reviewer", status: "draft", runs: 0 },
        ...MOCK_WORKFLOWS
      ]);
    }, 2000);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Engine Offline</h2>
        <p className="text-[#8A8A93]">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
          Reboot Engine
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workflow Engine</h1>
          <p className="text-sm text-[#8A8A93] mt-1">Orchestrate agents, automate tasks, and build pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAISuggestion}
            disabled={isGenerating || isLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
            AI Suggestions
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-transform active:scale-95">
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: "dashboard", label: "Dashboard", icon: Workflow },
          { id: "builder", label: "Builder", icon: Settings2 },
          { id: "history", label: "Run History", icon: History },
          { id: "templates", label: "Templates", icon: Blocks },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "bg-white/10 text-white border border-white/5"
                : "text-[#8A8A93] hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 text-[#00D2D3] animate-spin mb-4" />
            <p className="text-[#8A8A93] text-sm">Initializing cognitive engine...</p>
          </div>
        ) : workflows.length === 0 && activeTab === "dashboard" ? (
          <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-white/10 rounded-xl bg-white/5">
            <Network className="w-12 h-12 text-[#8A8A93] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No active workflows</h3>
            <p className="text-[#8A8A93] text-sm text-center max-w-md mb-6">
              Create your first workflow to automate repetitive tasks or browse our library of AI templates.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab("templates")} className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors">
                Browse Templates
              </button>
              <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors">
                Build from Scratch
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Active Pipelines</h3>
                  <div className="space-y-3">
                    {workflows.map(wf => (
                      <div key={wf.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0A0A0C]/50 hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={clsx(
                            "w-10 h-10 rounded-lg flex items-center justify-center border",
                            wf.status === "active" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                            wf.status === "paused" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                            "bg-white/5 border-white/10 text-[#A0A0A5]"
                          )}>
                            <Network className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white">{wf.name}</h4>
                            <p className="text-xs text-[#8A8A93] mt-0.5">
                              {wf.status === "active" && wf.lastRun ? `Last run: ${wf.lastRun}` : wf.status} • {wf.runs} total runs
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {wf.status === "active" ? (
                            <button className="p-2 rounded-md hover:bg-white/10 text-[#A0A0A5] hover:text-white transition-colors" title="Pause">
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="p-2 rounded-md hover:bg-white/10 text-[#A0A0A5] hover:text-white transition-colors" title="Run">
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 rounded-md hover:bg-white/10 text-[#A0A0A5] hover:text-white transition-colors" title="More options">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border border-white/5 bg-gradient-to-b from-[#0A0A0C] to-[#0A0A0C]/50">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Engine Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#8A8A93]">Success Rate</span>
                          <span className="text-green-400 font-medium">99.2%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '99.2%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#8A8A93]">Compute Usage</span>
                          <span className="text-[#00D2D3] font-medium">45%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <div className="bg-[#00D2D3] h-1.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "builder" && (
              <div className="flex flex-col h-[500px] border border-white/5 rounded-xl bg-[#0A0A0C]/50 overflow-hidden relative">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0A0A0C]">
                  <h3 className="text-sm font-medium text-white">Visual Builder</h3>
                  <div className="flex items-center gap-2">
                    <button className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors">Test Run</button>
                    <button className="text-xs px-3 py-1.5 rounded bg-[#6C5CE7] hover:bg-[#6C5CE7]/90 text-white transition-colors">Deploy</button>
                  </div>
                </div>
                {/* Visual Builder Canvas Mock */}
                <div className="flex-1 p-8 overflow-auto relative flex items-start justify-center">
                   {/* Background Grid */}
                   <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                   
                   {/* Node chain */}
                   <div className="flex flex-col items-center gap-6 relative z-10 mt-10">
                     <div className="w-64 p-4 rounded-xl border border-[#6C5CE7]/30 bg-[#0A0A0C] shadow-lg">
                       <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                         <Mail className="w-4 h-4 text-[#6C5CE7]" /> Trigger: New Email
                       </div>
                       <p className="text-xs text-[#8A8A93]">When an email arrives from @client.com</p>
                     </div>
                     
                     <div className="w-px h-6 bg-white/20"></div>
                     
                     <div className="w-64 p-4 rounded-xl border border-[#00D2D3]/30 bg-[#0A0A0C] shadow-lg">
                       <div className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                         <MessageSquare className="w-4 h-4 text-[#00D2D3]" /> Action: LLM Summarize
                       </div>
                       <p className="text-xs text-[#8A8A93]">Extract key action items via Gemini Pro</p>
                     </div>

                     <div className="w-px h-6 bg-white/20"></div>
                     
                     <div className="w-64 p-4 rounded-xl border border-white/10 bg-[#0A0A0C] shadow-lg border-dashed text-center">
                       <button className="text-xs text-[#A0A0A5] hover:text-white transition-colors flex items-center justify-center gap-1 w-full">
                         <Plus className="w-3 h-3" /> Add Node
                       </button>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Daily Standup Synthesis</h4>
                        <p className="text-xs text-[#8A8A93]">Triggered via Schedule • {i * 10} mins ago</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#A0A0A5] font-mono">1.2s</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "templates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_TEMPLATES.map(tpl => (
                  <div key={tpl.id} className="p-5 rounded-xl border border-white/5 bg-[#0A0A0C]/50 hover:border-white/20 transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 text-white group-hover:bg-[#6C5CE7]/20 group-hover:text-[#6C5CE7] transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-medium text-white mb-2">{tpl.name}</h4>
                    <p className="text-xs text-[#8A8A93] line-clamp-2">{tpl.desc}</p>
                    <button className="mt-4 text-xs font-medium text-[#6C5CE7] hover:text-[#00D2D3] transition-colors flex items-center gap-1">
                      Use Template <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
