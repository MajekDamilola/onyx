"use client";

import Link from "next/link";
import {
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
    <aside className="flex gap-2 overflow-x-auto border-b border-[#2a2a26] bg-bg/80 p-4 md:w-64 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
      <Link href="/dashboard" className="hidden text-xl font-bold tracking-tight text-cream md:block">
        ONYX
      </Link>
      {navGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="flex gap-0.5 md:flex-col"
        >
          {groupIndex > 0 && <div className="hidden h-px bg-[#2a2a26] md:my-2 md:block" />}
          {group.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative flex min-h-[38px] items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium md:w-full ${
                  isActive
                    ? "border-l-2 border-mint bg-surface-2 pl-3 text-cream"
                    : "text-muted hover:text-cream hover:bg-surface rounded-lg transition-colors"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-mint" : "text-muted"}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
