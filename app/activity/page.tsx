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
  All:     [],
  Escrow:  ["escrow_created", "escrow_completed", "escrow_disputed"],
  AutoPay: ["autopay_sent"],
  Split:   ["split_received", "split_created"],
  Payroll: ["payroll_sent"],
  Send:    ["send"],
};

const TYPE_CONFIG: Record<string, { icon: typeof Shield; color: string; prefix: string }> = {
  escrow_created: { icon: Shield,      color: "text-[#BBEBE1]",   prefix: "-" },
  send:           { icon: ArrowUpRight, color: "text-blue-400",    prefix: "-" },
  split_received: { icon: GitBranch,   color: "text-purple-400",  prefix: "+" },
  payroll_sent:   { icon: Users,       color: "text-amber-400",   prefix: "-" },
  autopay_sent:   { icon: RefreshCw,   color: "text-green-400",   prefix: "-" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  active:    { label: "Active",    color: "text-[#BBEBE1] border-[#BBEBE1]/30", icon: Clock },
  completed: { label: "Completed", color: "text-muted border-[#2a2a26]",        icon: CheckCircle },
  pending:   { label: "Pending",   color: "text-amber-400 border-amber-400/30", icon: Clock },
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
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const filtered =
    activeFilter === "All"
      ? mockActivity
      : mockActivity.filter((item) => FILTER_TYPES[activeFilter]?.includes(item.type));

  return (
    <div className="min-h-screen bg-[#141414] text-cream">
      <Topbar />
      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="activity" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#2a2a26] pb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">History</p>
              <h1 className="text-4xl font-black tracking-tight text-cream">Activity</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                All your transaction history across escrow, payments, splits and payroll.
              </p>
            </div>

            {/* Summary stats */}
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Total sent this month",     value: "$0.00" },
                { label: "Total received this month", value: "$0.00" },
                { label: "Active contracts",          value: "0" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-cream">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {Object.keys(FILTER_TYPES).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-[3px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    activeFilter === filter
                      ? "bg-[#BBEBE1] text-[#141414]"
                      : "border border-[#2a2a26] text-muted hover:border-[#3a3a36] hover:text-cream"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Activity feed */}
            {filtered.length === 0 ? (
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-12 text-center">
                <p className="text-sm font-semibold text-cream">No activity found</p>
                <p className="mt-1 text-xs text-muted">No transactions match this filter yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((item) => {
                  const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG["send"];
                  const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG["completed"];
                  const Icon = config.icon;
                  const StatusIcon = statusCfg.icon;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4 transition-colors hover:border-[#3a3a36]"
                    >
                      {/* Icon */}
                      <Icon className={`h-4 w-4 shrink-0 ${config.color}`} />

                      {/* Center */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-cream">{item.title}</p>
                        <p className="text-xs text-muted">{item.description}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted/70">{item.counterparty}</p>
                      </div>

                      {/* Right */}
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${config.prefix === "+" ? "text-green-400" : "text-cream"}`}>
                          {config.prefix}{item.amount} {item.token}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted">{item.date}</p>
                        <span className={`mt-1 inline-flex items-center gap-1 rounded-[3px] border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${statusCfg.color}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-8 text-center text-[10px] text-muted">
              Transaction history will sync automatically once contracts are deployed on Sepolia.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
