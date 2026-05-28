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
      {navGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="flex gap-2 md:flex-col md:border-b md:border-[#2a2a26] md:pb-4 md:last:border-b-0 md:last:pb-0"
        >
          {group.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={`group relative inline-flex min-h-11 items-center gap-3 whitespace-nowrap rounded-2xl border px-3 py-2.5 text-sm transition-colors md:w-full ${
                  isActive
                    ? "border-[#2a2a26] bg-surface-2 font-semibold text-cream"
                    : "border-transparent text-muted hover:border-[#3a3a36] hover:bg-surface hover:text-cream"
                }`}
              >
                <span
                  className={`absolute left-0 top-2 hidden h-7 w-0.5 rounded-full bg-mint md:block ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon className={`h-4 w-4 ${isActive ? "text-mint" : "text-muted group-hover:text-mint"}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
