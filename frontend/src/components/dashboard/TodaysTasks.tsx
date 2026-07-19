"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Plus, X } from "lucide-react";
import { clsx } from "clsx";
import { useQuery } from "@tanstack/react-query";
import { tasksAPI, type Task as APITask } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  category: "Deep Work" | "Meeting" | "Admin";
}

export function TodaysTasks({ isLoading: externalLoading }: { isLoading?: boolean }) {
  const { data: initialTasks = [], isLoading: isQueryLoading, isError, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksAPI.getTasks,
  });

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<"Deep Work" | "Meeting" | "Admin">("Deep Work");

  useEffect(() => {
    if (initialTasks.length > 0 && !isPlanning) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalTasks(initialTasks.map((t: APITask) => ({
        id: t.id,
        title: t.title,
        completed: t.status === "COMPLETED",
        time: t.scheduledStart,
        category: t.priority === "HIGH" || t.priority === "URGENT" ? "Deep Work" : "Admin"
      })));
    }
  }, [initialTasks, isPlanning]);

  const toggleTask = (id: string) => {
    setLocalTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle.trim(),
      completed: false,
      category: newTaskCategory,
    };
    setLocalTasks(prev => [newTask, ...prev]);
    setNewTaskTitle("");
    setShowAddForm(false);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAIPlan = async () => {
    setIsPlanning(true);
    try {
      const res = await fetch("/api/ai/plan-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: "Plan tasks for a highly productive workday" })
      });
      if (res.ok) {
        const { tasks } = await res.json();
        const newTasks = tasks.map((t: { title: string; priority: string; description: string }) => ({
          id: Math.random().toString(),
          title: t.title,
          priority: t.priority,
          status: "TODO",
          category: t.priority === "HIGH" ? "Deep Work" : "Admin",
          completed: false,
          time: t.description
        }));
        setLocalTasks(prev => [...prev, ...newTasks]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlanning(false);
    }
  };

  const isLoading = externalLoading || isQueryLoading;

  if (isLoading) {
    return (
      <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-medium text-lg text-white">Today&apos;s Focus</h2>
        </div>
        <div className="flex-1 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col items-center justify-center text-center">
        <p className="text-red-400 mb-2">Failed to load tasks</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-medium text-lg text-white">Top Task Priority</h2>
        <div className="flex gap-2 items-center">
          <button 
            onClick={handleAIPlan}
            disabled={isPlanning}
            className="text-[10px] font-semibold bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3] text-white px-2 py-1 rounded transition-opacity hover:opacity-80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50"
          >
            {isPlanning ? "Planning your schedule..." : "AI Plan"}
          </button>
          <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md text-[#A0A0A5]">{localTasks.length} tasks</span>
          <button
            onClick={() => setShowAddForm(v => !v)}
            className="flex items-center gap-1 text-xs font-semibold bg-white text-black px-2.5 py-1 rounded-md hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50"
          >
            <Plus className="w-3 h-3" />
            Add Task
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-4 p-3 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            autoFocus
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAddTask(); if (e.key === "Escape") setShowAddForm(false); }}
            className="w-full bg-transparent text-white text-sm placeholder:text-[#8A8A93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50 rounded-sm border-b border-white/10 pb-2"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {(["Deep Work", "Meeting", "Admin"] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewTaskCategory(cat)}
                  className={clsx(
                    "text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50",
                    newTaskCategory === cat
                      ? cat === "Deep Work" ? "bg-[#6C5CE7]/30 text-[#6C5CE7] border border-[#6C5CE7]/50"
                        : cat === "Meeting" ? "bg-[#00D2D3]/30 text-[#00D2D3] border border-[#00D2D3]/50"
                        : "bg-white/20 text-white border border-white/30"
                      : "bg-white/5 text-[#A0A0A5] border border-transparent hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddForm(false)} className="text-xs text-[#A0A0A5] hover:text-white transition-colors px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50 rounded-sm">
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="text-xs font-semibold bg-white text-black px-3 py-1 rounded-md hover:bg-white/90 disabled:opacity-40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      {localTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#A0A0A5]" />
          </div>
          <p className="text-sm text-[#A0A0A5] mb-4">Create your first task or let AI generate today's plan.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50"
          >
            <Plus className="w-4 h-4" />
            Add your first task
          </button>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {localTasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(task.id); } }}
              className={clsx(
                "group/task flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50",
                task.completed 
                  ? "border-transparent bg-white/[0.02]" 
                  : "border-white/5 bg-[#16161A]/50 hover:bg-[#16161A]"
              )}
            >
              <div className="mt-0.5">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00B894] transition-transform duration-300 scale-100" />
                ) : (
                  <Circle className="w-5 h-5 text-[#A0A0A5] group-hover/task:text-white transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  "text-sm transition-all duration-300",
                  task.completed ? "text-[#A0A0A5] line-through" : "text-white font-medium"
                )}>
                  {task.title}
                </p>
                {task.time && (
                  <p className="text-xs text-[#A0A0A5] mt-1 font-mono">{task.time}</p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className={clsx(
                  "text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded",
                  task.category === "Deep Work" && "bg-[#6C5CE7]/10 text-[#6C5CE7]",
                  task.category === "Meeting" && "bg-[#00D2D3]/10 text-[#00D2D3]",
                  task.category === "Admin" && "bg-white/5 text-[#A0A0A5]"
                )}>
                  {task.category}
                </span>
                <button
                  onClick={(e) => handleDeleteTask(task.id, e)}
                  aria-label="Delete task"
                  className="opacity-0 group-hover/task:opacity-100 p-1 rounded text-[#A0A0A5] hover:text-red-400 hover:bg-red-400/10 transition-all focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
