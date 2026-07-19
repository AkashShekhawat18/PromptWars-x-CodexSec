"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ListTodo, 
  Brain, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { clsx } from "clsx";

// Types
type TabType = "daily" | "weekly" | "matrix" | "focus";
type TaskStatus = "todo" | "in-progress" | "done";
type Priority = "urgent-important" | "urgent-unimportant" | "not-urgent-important" | "not-urgent-unimportant";

interface PlanTask {
  id: string;
  title: string;
  time?: string;
  duration?: number; // minutes
  status: TaskStatus;
  priority: Priority;
}

// Mock Data
const MOCK_DAILY_TASKS: PlanTask[] = [
  { id: "1", title: "Review Q3 Marketing Strategy", time: "09:00 AM", duration: 60, status: "done", priority: "urgent-important" },
  { id: "2", title: "Sync with Design Team", time: "10:30 AM", duration: 45, status: "in-progress", priority: "not-urgent-important" },
  { id: "3", title: "Write Release Notes", time: "01:00 PM", duration: 90, status: "todo", priority: "urgent-important" },
  { id: "4", title: "Reply to Partnership Emails", time: "03:00 PM", duration: 30, status: "todo", priority: "urgent-unimportant" },
];

export function AdaptivePlanner() {
  const [activeTab, setActiveTab] = useState<TabType>("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<PlanTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Focus Session State
  const [focusTimeLeft, setFocusTimeLeft] = useState(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState(false);

  // Simulate Initial Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(MOCK_DAILY_TASKS);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusActive && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (focusTimeLeft === 0) {
      setIsFocusActive(false);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, focusTimeLeft]);

  const handleGenerateAISchedule = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Shuffle or add some tasks to mock AI generation
      setTasks([
        { id: "ai1", title: "Deep Work: Architecture Design", time: "08:00 AM", duration: 120, status: "todo", priority: "urgent-important" },
        ...MOCK_DAILY_TASKS
      ]);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Failed to load planner</h2>
        <p className="text-[#8A8A93]">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Adaptive Planner</h1>
          <p className="text-sm text-[#8A8A93] mt-1">AI-assisted scheduling, time blocking, and focus management.</p>
        </div>
        <button 
          onClick={handleGenerateAISchedule}
          disabled={isGenerating || isLoading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {isGenerating ? "Optimizing Schedule..." : "AI Schedule Suggestions"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: "daily", label: "Daily Planning", icon: Clock },
          { id: "weekly", label: "Weekly View", icon: Calendar },
          { id: "matrix", label: "Priority Matrix", icon: ListTodo },
          { id: "focus", label: "Focus Sessions", icon: Play },
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
            <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin mb-4" />
            <p className="text-[#8A8A93] text-sm">Loading your intelligent schedule...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-white/10 rounded-xl bg-white/5">
            <Calendar className="w-12 h-12 text-[#8A8A93] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No tasks scheduled</h3>
            <p className="text-[#8A8A93] text-sm text-center max-w-md mb-6">
              Your planner is empty. Add tasks manually or let NeuroFlow AI analyze your goals and generate an optimized schedule.
            </p>
            <button onClick={handleGenerateAISchedule} className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors">
              Generate AI Schedule
            </button>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "daily" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Time Blocking</h3>
                  {tasks.sort((a, b) => (a.time || "").localeCompare(b.time || "")).map(task => (
                    <div key={task.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-[#0A0A0C]/50 hover:bg-white/5 transition-colors group">
                      <div className="min-w-[80px] text-sm font-medium text-[#A0A0A5] pt-1">
                        {task.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={clsx("text-base font-medium", task.status === "done" ? "text-[#8A8A93] line-through" : "text-white")}>
                            {task.title}
                          </h4>
                          <span className={clsx(
                            "text-xs px-2 py-1 rounded border",
                            task.status === "done" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            task.status === "in-progress" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            "bg-white/5 text-[#A0A0A5] border-white/10"
                          )}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#8A8A93] mt-1">{task.duration} mins • {task.priority.replace("-", " ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border border-white/5 bg-gradient-to-b from-[#0A0A0C] to-[#0A0A0C]/50">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">AI Insights</h3>
                    <ul className="space-y-3 text-sm text-[#8A8A93]">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00D2D3] mt-1.5 shrink-0" />
                        <span>You have 2 high-priority tasks scheduled for the morning. Excellent time-blocking.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0" />
                        <span>Consider adding a 15-minute buffer after "Sync with Design Team" to avoid burnout.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "weekly" && (
              <div className="grid grid-cols-5 gap-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => (
                  <div key={day} className="min-h-[300px] p-4 rounded-xl border border-white/5 bg-[#0A0A0C]/50">
                    <h4 className="text-sm font-medium text-white mb-4 text-center">{day}</h4>
                    {day === "Mon" ? (
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-[#6C5CE7]/20 border border-[#6C5CE7]/30 text-xs text-white">Marketing Sync (1h)</div>
                        <div className="p-2 rounded bg-white/5 border border-white/10 text-xs text-[#A0A0A5]">Design Review</div>
                      </div>
                    ) : (
                      <div className="text-xs text-center text-[#8A8A93] mt-8">No tasks scheduled</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "matrix" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col">
                  <h4 className="text-sm font-semibold text-red-400 mb-4 uppercase tracking-wider">Do First (Urgent & Important)</h4>
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {tasks.filter(t => t.priority === "urgent-important").map(t => (
                      <div key={t.id} className="p-3 bg-[#0A0A0C] border border-white/5 rounded-lg text-sm text-white">{t.title}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex flex-col">
                  <h4 className="text-sm font-semibold text-blue-400 mb-4 uppercase tracking-wider">Schedule (Important, Not Urgent)</h4>
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {tasks.filter(t => t.priority === "not-urgent-important").map(t => (
                      <div key={t.id} className="p-3 bg-[#0A0A0C] border border-white/5 rounded-lg text-sm text-white">{t.title}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex flex-col">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-4 uppercase tracking-wider">Delegate (Urgent, Not Important)</h4>
                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {tasks.filter(t => t.priority === "urgent-unimportant").map(t => (
                      <div key={t.id} className="p-3 bg-[#0A0A0C] border border-white/5 rounded-lg text-sm text-white">{t.title}</div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col">
                  <h4 className="text-sm font-semibold text-[#8A8A93] mb-4 uppercase tracking-wider">Eliminate (Neither)</h4>
                  <div className="space-y-2 flex-1 overflow-y-auto text-center text-xs text-[#8A8A93] pt-8">
                    Clear schedule!
                  </div>
                </div>
              </div>
            )}

            {activeTab === "focus" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative w-64 h-64 rounded-full border-4 border-white/10 flex items-center justify-center bg-gradient-to-br from-[#0A0A0C] to-[#1A1A24] shadow-2xl">
                  {isFocusActive && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-[#6C5CE7]"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: 1.05, opacity: [0, 0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                  <div className="text-5xl font-bold tracking-tighter text-white font-mono z-10">
                    {formatTime(focusTimeLeft)}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-12">
                  <button 
                    onClick={() => setIsFocusActive(!isFocusActive)}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-transform active:scale-95"
                  >
                    {isFocusActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    {isFocusActive ? "Pause Focus" : "Start Focus"}
                  </button>
                  <button 
                    onClick={() => { setIsFocusActive(false); setFocusTimeLeft(25 * 60); }}
                    className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    title="Reset Timer"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-[#8A8A93] mt-6 text-center max-w-sm">
                  NeuroFlow recommends a 25-minute Pomodoro block to tackle your highest priority task.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
