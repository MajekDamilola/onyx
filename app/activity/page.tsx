"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  GitBranch,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const mockActivity = [
  {
    id: "1",
    type: "escrow_created",
    title: "Escrow created",
    description: "Website redesign milestone 1",
    amount: "500",
    token: "USDC",
    status: "active",
    date: "2026-01-15",
    counterparty: "0x1234...5678",
  },
  {
    id: "2",
    type: "send",
    title: "Sent USDC",
    description: "Transfer to contractor",
    amount: "150",
    token: "USDC",
    status: "completed",
    date: "2026-01-14",
    counterparty: "0xabcd...efgh",
  },
  {
    id: "3",
    type: "split_received",
    title: "Split received",
    description: "Agency revenue split",
    amount: "300",
    token: "USDC",
    status: "completed",
    date: "2026-01-13",
    counterparty: "0x9876...5432",
  },
  {
    id: "4",
    type: "payroll_sent",
    title: "Payroll executed",
    description: "Engineering team — January",
    amount: "2400",
    token: "USDC",
    status: "completed",
    date: "2026-01-01",
    counterparty: "4 contractors",
  },
  {
    id: "5",
    type: "autopay_sent",
    title: "AutoPay executed",
    description: "Monthly retainer",
    amount: "800",
    token: "USDT",
    status: "completed",
    date: "2025-12-31",
    counterparty: "0x1111...2222",
  },
];

const FILTER_TYPES: Record<string, string[]> = {
  All: [],
  Escrow: ["escrow_created", "escrow_completed", "escrow_disputed"],
  AutoPay: ["autopay_sent"],
  Split: ["split_received", "split_created"],
  Payroll: ["payroll_sent"],
  Send: ["send"],
};

const TYPE_CONFIG: Record<string, { icon: typeof Shield; color: string; bgColor: string; prefix: string }> = {
  escrow_created: { icon: Shield, color: "text-mint", bgColor: "bg-mint/10", prefix: "-" },
  send: { icon: ArrowUpRight, color: "text-blue-400", bgColor: "bg-blue-400/10", prefix: "-" },
  split_received: { icon: GitBranch, color: "text-purple-400", bgColor: "bg-purple-400/10", prefix: "+" },
  payroll_sent: { icon: Users, color: "text-amber-400", bgColor: "bg-amber-400/10", prefix: "-" },
  autopay_sent: { icon: RefreshCw, color: "text-green-400", bgColor: "bg-green-400/10", prefix: "-" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  active: { label: "Active", color: "text-mint border-mint/30 bg-mint/10", icon: Clock },
  completed: { label: "Completed", color: "text-muted border-[#2a2a26] bg-[#1c1c1a]", icon: CheckCircle },
  pending: { label: "Pending", color: "text-amber-400 border-amber-400/30 bg-amber-400/10", icon: Clock },
};

export default function ActivityPage() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const filtered =
    activeFilter === "All"
      ? mockActivity
      : mockActivity.filter((item) => FILTER_TYPES[activeFilter]?.includes(item.type));

  return (
    <div className="min-h-screen bg-bg text-cream">
      <Topbar />
      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="activity" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-12 top-10 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            {/* Header */}
            <div className="mb-8 pb-8 border-b border-[#2a2a26]">
              <h1 className="text-5xl font-bold tracking-tight text-cream">Activity</h1>
              <div className="mt-3 h-1 w-12 rounded-full bg-mint" />
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
                All your transaction history across escrow, payments, splits and payroll.
              </p>
            </div>

            {/* Summary stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Total sent this month", value: "$0.00" },
                { label: "Total received this month", value: "$0.00" },
                { label: "Active contracts", value: "0" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#2a2a26] bg-gradient-to-br from-surface to-surface-2 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint/60">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-cream">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filter pills */}
            <div className="mb-5 flex flex-wrap gap-2">
              {Object.keys(FILTER_TYPES).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    activeFilter === filter
                      ? "bg-mint text-bg"
                      : "border border-[#2a2a26] text-muted hover:border-mint/40 hover:text-cream"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Activity feed */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-[#2a2a26] bg-surface p-16 text-center">
                <p className="text-base font-semibold text-cream">No activity found</p>
                <p className="mt-2 text-sm text-muted">No transactions match this filter yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => {
                  const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG["send"];
                  const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG["completed"];
                  const Icon = config.icon;
                  const StatusIcon = statusCfg.icon;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-[#2a2a26] bg-surface p-5 transition-colors hover:border-[#3a3a36]"
                    >
                      {/* Icon */}
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      {/* Center */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-cream">{item.title}</p>
                        <p className="text-sm text-muted">{item.description}</p>
                        <p className="mt-0.5 font-mono text-xs text-muted/70">{item.counterparty}</p>
                      </div>

                      {/* Right */}
                      <div className="text-right shrink-0">
                        <p className={`text-base font-bold ${config.prefix === "+" ? "text-green-400" : "text-cream"}`}>
                          {config.prefix}{item.amount} {item.token}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{item.date}</p>
                        <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusCfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-8 text-center text-xs text-muted">
              Transaction history will sync automatically once contracts are deployed on Sepolia.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
