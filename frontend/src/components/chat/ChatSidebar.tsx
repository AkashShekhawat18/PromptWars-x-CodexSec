"use client";

import { MessageSquare, Plus, MoreHorizontal } from "lucide-react";

const recentChats = [
  { id: "1", title: "Marketing Strategy Brainstorm", time: "Today" },
  { id: "2", title: "Analyze Q3 Reports", time: "Yesterday" },
  { id: "3", title: "Draft Email to Investors", time: "Previous 7 Days" },
  { id: "4", title: "UI Components Refactor", time: "Previous 7 Days" },
];

export function ChatSidebar() {
  return (
    <div className="w-64 h-full border-r border-white/5 bg-[#030303]/50 flex flex-col p-4 hidden md:flex">
      <button className="flex items-center justify-between w-full px-3 py-2.5 mb-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group">
        <span className="text-sm font-medium text-white">New Chat</span>
        <Plus className="w-4 h-4 text-[#A0A0A5] group-hover:text-white transition-colors" />
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          
          <div>
            <h3 className="px-3 text-xs font-semibold text-[#A0A0A5] mb-2 uppercase tracking-wider">Today</h3>
            {recentChats.filter(c => c.time === "Today").map(chat => (
              <button key={chat.id} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#16161A]/50 text-white border border-white/5 mb-1 group">
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="w-3.5 h-3.5 text-[#00D2D3] shrink-0" />
                  <span className="text-sm font-medium truncate">{chat.title}</span>
                </div>
                <MoreHorizontal className="w-3.5 h-3.5 text-[#A0A0A5] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-[#A0A0A5] mb-2 uppercase tracking-wider">Yesterday</h3>
            {recentChats.filter(c => c.time === "Yesterday").map(chat => (
              <button key={chat.id} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-[#A0A0A5] hover:text-white transition-colors mb-1 group">
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-[#A0A0A5] mb-2 uppercase tracking-wider">Previous 7 Days</h3>
            {recentChats.filter(c => c.time === "Previous 7 Days").map(chat => (
              <button key={chat.id} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-[#A0A0A5] hover:text-white transition-colors mb-1 group">
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
