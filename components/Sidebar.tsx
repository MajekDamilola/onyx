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
import OnyxMark from "@/components/OnyxMark";

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
    { key: "dashboard", label: "Overview",      href: "/dashboard", icon: LayoutDashboard },
    { key: "send",      label: "Send & Receive", href: "/send",      icon: Send },
    { key: "swap",      label: "Swap & Bridge",  href: "/swap",      icon: ArrowLeftRight },
  ],
  [
    { key: "escrow",  label: "Escrow",  href: "/escrow",  icon: Shield },
    { key: "autopay", label: "AutoPay", href: "/autopay", icon: RefreshCw },
    { key: "split",   label: "Split",   href: "/split",   icon: GitBranch },
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
    <aside className="flex gap-1 overflow-x-auto border-b border-[#252929] bg-[#0B0C0C] px-3 py-2 md:w-52 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:px-0 md:py-0">
      {/* Logo — desktop only */}
      <Link
        href="/dashboard"
        className="hidden md:flex items-center gap-2.5 px-5 py-[18px] border-b border-[#252929]"
      >
        <OnyxMark className="h-4 w-4 text-[#BCEDE2]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#F4F4EF]">ONYX</span>
      </Link>

      <div className="flex gap-0.5 md:flex-col md:flex-1 md:py-3">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-0.5 md:flex-col">
            {groupIndex > 0 && (
              <div className="hidden h-px bg-[#252929] md:block md:mx-4 md:my-1.5" />
            )}
            {group.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`relative flex min-h-[34px] items-center gap-2.5 whitespace-nowrap py-2 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors md:w-full ${
                    isActive
                      ? "text-[#F4F4EF] md:border-l-2 md:border-[#BCEDE2] md:pl-[14px] md:pr-4"
                      : "text-[#9A9E9B] hover:text-[#F4F4EF] md:pl-4 md:pr-4"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden md:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
