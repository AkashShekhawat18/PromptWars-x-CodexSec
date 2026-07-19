"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Settings, 
  BarChart, 
  Database, 
  Activity, 
  FileText,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const navItems = [
  { name: "Overview", href: "/admin", icon: BarChart },
  { name: "Users & RBAC", href: "/admin/users", icon: Users },
  { name: "Document Vault", href: "/admin/documents", icon: Database },
  { name: "AI Usage", href: "/admin/ai", icon: Cpu },
  { name: "Workflows", href: "/admin/workflows", icon: Activity },
  { name: "Audit Logs", href: "/admin/audit", icon: FileText },
  { name: "System Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-white/10 bg-[#050505] flex flex-col h-full flex-shrink-0">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Admin Console
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isActive
                  ? "text-white bg-white/10"
                  : "text-[#8A8A93] hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={clsx("w-5 h-5", isActive ? "text-blue-400" : "text-[#8A8A93] group-hover:text-white")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-xs text-blue-400 font-medium mb-1">Super Admin Access</p>
          <p className="text-[10px] text-[#8A8A93]">You have unrestricted platform access. All actions are logged.</p>
        </div>
      </div>
    </div>
  );
}
