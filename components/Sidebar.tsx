"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  CreditCard,
  FileText,
  GitBranch,
  LayoutDashboard,
  RefreshCw,
  Send,
  Settings,
  Shield,
  Users,
} from "lucide-react";

type ActivePage =
  | "dashboard"
  | "send"
  | "swap"
  | "escrow"
  | "autopay"
  | "split"
  | "payroll"
  | "activity"
  | "settings";

interface SidebarProps {
  activePage: ActivePage;
}

const navGroups = [
  [
    { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { key: "send", label: "Send & Receive", href: "/send", icon: Send },
    { key: "swap", label: "Swap & Bridge", href: "/swap", icon: ArrowLeftRight },
  ],
  [
    { key: "escrow", label: "Escrow", href: "/escrow", icon: Shield },
    { key: "autopay", label: "AutoPay", href: "/autopay", icon: RefreshCw },
    { key: "split", label: "Split", href: "/split", icon: GitBranch },
    { key: "payroll", label: "Payroll", href: "/payroll", icon: Users },
  ],
  [
    { key: "activity", label: "Activity", href: "/activity", icon: FileText },
    { key: "settings", label: "Settings", href: "/settings", icon: Settings },
  ],
] satisfies Array<
  Array<{
    key: ActivePage;
    label: string;
    href: string;
    icon: typeof CreditCard;
  }>
>;

export default function Sidebar({ activePage }: SidebarProps) {
  return (
    <aside className="flex gap-2 overflow-x-auto border-b border-[#2a2a26] bg-bg/80 p-4 md:w-64 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:justify-between">
      <div className="flex gap-2 md:flex-col md:flex-1">
        <Link href="/dashboard" className="hidden text-2xl font-bold tracking-tight text-cream md:block mb-2">
          ONYX
        </Link>
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-0.5 md:flex-col">
            {groupIndex > 0 && <div className="hidden h-px bg-[#2a2a26] md:my-2 md:block" />}
            {group.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`relative flex min-h-[38px] items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all md:w-full ${
                    isActive
                      ? "border-l-2 border-mint bg-mint/10 pl-3.5 text-cream"
                      : "text-muted hover:bg-white/5 hover:text-cream"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-mint" : "text-muted"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Network status — desktop only */}
      <div className="hidden md:block mt-4 pt-4 border-t border-[#2a2a26]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400/5 border border-amber-400/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          <span className="text-xs font-medium text-amber-400">Sepolia Testnet</span>
        </div>
      </div>
    </aside>
  );
}
