"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Network, 
  Workflow, 
  Settings, 
  ChevronDown,
  Lock,
  Brain
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "Focus Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Adaptive Planner", href: "/dashboard/planner", icon: Calendar },
  { name: "Knowledge Vault", href: "/dashboard/vault", icon: Network },
  { name: "Second Brain", href: "/dashboard/second-brain", icon: Brain },
  { name: "Workflow Engine", href: "/dashboard/workflows", icon: Workflow },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen border-r border-white/5 bg-[#030303] flex flex-col pt-6 pb-6 px-4">
      
      {/* Workspace Switcher */}
      <button className="flex items-center justify-between w-full p-2 mb-8 rounded-lg hover:bg-white/5 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center">
            <span className="text-white font-bold text-sm">NF</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-white group-hover:text-white/90">NeuroFlow Workspace</span>
            <span className="text-xs text-[#A0A0A5]">Pro Plan</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-[#A0A0A5] group-hover:text-white transition-colors" />
      </button>

      {/* Navigation */}
      <div className="flex-1 space-y-1">
        <p className="px-3 text-xs font-semibold text-[#A0A0A5] mb-4 uppercase tracking-wider">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isLocked = (item as any).isLocked;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={isLocked ? "#upgrade" : item.href}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  alert("This feature is locked in the Free Trial. Upgrade to Pro to unlock the Workflow Engine.");
                }
              }}
              className={clsx(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50",
                isActive && !isLocked
                  ? "bg-white/10 text-white shadow-[0_0_16px_rgba(108,92,231,0.15)] border border-[#6C5CE7]/25" 
                  : "text-[#A0A0A5] hover:text-white hover:bg-white/5 border border-transparent",
                isLocked && "opacity-70 hover:bg-transparent hover:text-[#A0A0A5] cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={clsx("w-4 h-4", isActive && !isLocked ? "text-[#00D2D3]" : "text-[#A0A0A5]")} />
                {item.name}
              </div>
              {isLocked && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Pro</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Settings */}
      <div className="pt-4 border-t border-white/5 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#A0A0A5] hover:text-white hover:bg-white/5 w-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

    </div>
  );
}
