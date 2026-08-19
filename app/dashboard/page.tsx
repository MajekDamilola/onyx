"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  GitBranch,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { loadActivity, type ActivityItem } from "@/lib/activity-data";

const quickStart = [
  { title: "Escrow",  href: "/escrow",  icon: Shield,    description: "Lock funds with a 48-hour dispute window." },
  { title: "AutoPay", href: "/autopay", icon: RefreshCw, description: "Schedule recurring wallet payments." },
  { title: "Split",   href: "/split",   icon: GitBranch, description: "Create an address that distributes instantly." },
  { title: "Payroll", href: "/payroll", icon: Users,     description: "Pay contractors on a fixed schedule." },
];

function fmtNum(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(ts: number) {
  return ts
    ? new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
}

export default function Dashboard() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || "";

  const [totalSent, setTotalSent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [activeContracts, setActiveContracts] = useState(0);
  const [recentItems, setRecentItems] = useState<ActivityItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!walletAddress) return;
    let cancelled = false;
    loadActivity(walletAddress).then((summary) => {
      if (cancelled) return;
      setTotalSent(summary.totalSent);
      setTotalReceived(summary.totalReceived);
      setActiveContracts(summary.activeContracts);
      setRecentItems(summary.items.slice(0, 5));
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0A]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const summaryCards = [
    { label: "Total Sent",      value: `$${fmtNum(totalSent)}`,     sub: "on Sepolia testnet",  icon: ArrowUpRight },
    { label: "Total Received",  value: loaded ? `$${fmtNum(totalReceived)}` : "—", sub: "on Sepolia testnet",  icon: ArrowDownLeft },
    { label: "Active Contracts",value: String(activeContracts),     sub: "contracts running",   icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#090A0A] text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="dashboard" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">

            {/* Header */}
            <div className="mb-8 border-b border-[#252929] pb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Console</p>
              <h1 className="text-4xl font-black tracking-tight text-cream">Overview</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Define a payment rule and ONYX handles execution automatically.
              </p>
            </div>

            {/* Summary cards */}
            <div className="mb-8 grid gap-3 md:grid-cols-3">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5"
                  >
                    <Icon className="mb-4 h-4 w-4 text-[#BCEDE2]" />
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9E9B]">{card.label}</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-cream">{card.value}</p>
                    <p className="mt-1 text-xs text-[#9A9E9B]">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent activity */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Recent Activity</p>
                <button
                  type="button"
                  onClick={() => router.push("/activity")}
                  className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9E9B] transition-colors hover:text-cream"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              {recentItems.length === 0 ? (
                <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-10 text-center">
                  <FileText className="mx-auto mb-3 h-5 w-5 text-[#9A9E9B]" />
                  <p className="text-sm font-semibold text-cream">No activity yet</p>
                  <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted">
                    Create your first programmable payment and let ONYX handle execution automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-[12px] border border-[#252929] bg-[#0E1010] p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-cream">{item.title}</p>
                        <p className="mt-0.5 truncate text-[10px] text-muted">{item.subtitle}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-cream">
                          {item.category === "sent" ? "-" : item.category === "received" ? "+" : ""}{item.amount} {item.token}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted">{formatDate(item.sortKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quick start */}
            <section>
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Quick Start</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-cream">Choose a contract type</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {quickStart.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="group rounded-[12px] border border-[#252929] bg-[#0E1010] p-5 transition-colors hover:border-[#313737]"
                    >
                      <Icon className="mb-4 h-4 w-4 text-[#BCEDE2]" />
                      <h3 className="text-sm font-bold text-cream">{item.title}</h3>
                      <p className="mt-2 min-h-10 text-xs leading-5 text-muted">{item.description}</p>
                      <button
                        type="button"
                        onClick={() => router.push(item.href)}
                        className="mt-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#BCEDE2] transition-colors hover:text-white"
                      >
                        Create →
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
