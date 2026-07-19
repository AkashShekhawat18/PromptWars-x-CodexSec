"use client";

import { useEffect, useState } from "react";
import { CheckCircle, FileText, Workflow, MessageSquare, Loader2, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  title: string;
  date: string;
  icon: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch("/api/activity");
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const renderIcon = (iconStr: string) => {
    switch (iconStr) {
      case "CheckCircle": return <CheckCircle className="w-4 h-4 text-[#00B894]" />;
      case "FileText": return <FileText className="w-4 h-4 text-[#0984E3]" />;
      case "Workflow": return <Workflow className="w-4 h-4 text-[#6C5CE7]" />;
      case "MessageSquare": return <MessageSquare className="w-4 h-4 text-[#E84393]" />;
      default: return <Clock className="w-4 h-4 text-[#A0A0A5]" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-medium text-lg text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#6C5CE7]" />
          Recent Activity
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3 text-[#A0A0A5]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading timeline...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[#A0A0A5]">
            <p className="text-sm">No recent activity found.</p>
          </div>
        ) : (
          <div className="relative border-l border-white/10 ml-2 space-y-6 pb-2">
            {activities.map((activity, idx) => (
              <div key={activity.id} className="relative pl-6">
                {/* Timeline dot */}
                <div className="absolute -left-2.5 top-1 w-5 h-5 bg-[#0C0C0E] rounded-full flex items-center justify-center border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A0A0A5]"></div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg shrink-0 mt-0.5">
                    {renderIcon(activity.icon)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#A0A0A5] mb-0.5 uppercase tracking-wider">{activity.type}</p>
                    <p className="text-sm text-white font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-[#A0A0A5] mt-1">{formatTime(activity.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
