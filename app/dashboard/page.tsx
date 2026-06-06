"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowUpRight,
  FileText,
  GitBranch,
  Lock,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const summaryCards = [
  { label: "Total Locked",     value: "$0.00", sub: "across all contracts", icon: Lock },
  { label: "Total Sent",       value: "$0.00", sub: "this month",           icon: ArrowUpRight },
  { label: "Active Contracts", value: "0",     sub: "contracts running",    icon: FileText },
];

const quickStart = [
  { title: "Escrow",  href: "/escrow",  icon: Shield,    description: "Lock funds with a 48-hour dispute window." },
  { title: "AutoPay", href: "/autopay", icon: RefreshCw, description: "Schedule recurring wallet payments." },
  { title: "Split",   href: "/split",   icon: GitBranch, description: "Create an address that distributes instantly." },
  { title: "Payroll", href: "/payroll", icon: Users,     description: "Pay contractors on a fixed schedule." },
];

export default function Dashboard() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-[#141414] text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="dashboard" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">

            {/* Header */}
            <div className="mb-8 border-b border-[#2a2a26] pb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Overview</p>
              <h1 className="text-4xl font-black tracking-tight text-cream">Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Welcome to ONYX. Create your first contract to start moving money programmatically.
              </p>
            </div>

            {/* Summary cards */}
            <div className="mb-8 grid gap-3 md:grid-cols-3">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5"
                  >
                    <Icon className="mb-4 h-4 w-4 text-[#BBEBE1]" />
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6b6760]">{card.label}</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-cream">{card.value}</p>
                    <p className="mt-1 text-xs text-[#6b6760]">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent activity */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Recent Activity</p>
                <button
                  type="button"
                  onClick={() => router.push("/activity")}
                  className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#6b6760] transition-colors hover:text-cream"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-10 text-center">
                <FileText className="mx-auto mb-3 h-5 w-5 text-[#6b6760]" />
                <p className="text-sm font-semibold text-cream">No activity yet</p>
                <p className="mt-1 text-xs text-muted">Your transactions will appear here once you start.</p>
              </div>
            </section>

            {/* Quick start */}
            <section>
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Quick Start</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-cream">Choose a contract type</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {quickStart.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="group rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5 transition-colors hover:border-[#3a3a36]"
                    >
                      <Icon className="mb-4 h-4 w-4 text-[#BBEBE1]" />
                      <h3 className="text-sm font-bold text-cream">{item.title}</h3>
                      <p className="mt-2 min-h-10 text-xs leading-5 text-muted">{item.description}</p>
                      <button
                        type="button"
                        onClick={() => router.push(item.href)}
                        className="mt-5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#BBEBE1] transition-colors hover:text-white"
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
