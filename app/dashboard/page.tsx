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
  { label: "Total Locked", value: "$0.00", sub: "across all contracts", icon: Lock, gradient: "from-mint/5 to-transparent" },
  { label: "Total Sent", value: "$0.00", sub: "this month", icon: ArrowUpRight, gradient: "from-blue-400/5 to-transparent" },
  { label: "Active Contracts", value: "0", sub: "contracts running", icon: FileText, gradient: "from-purple-400/5 to-transparent" },
];

const quickStart = [
  { title: "Escrow", href: "/escrow", icon: Shield, description: "Lock funds with a 48-hour dispute window." },
  { title: "AutoPay", href: "/autopay", icon: RefreshCw, description: "Schedule recurring wallet payments." },
  { title: "Split", href: "/split", icon: GitBranch, description: "Create an address that distributes instantly." },
  { title: "Payroll", href: "/payroll", icon: Users, description: "Pay contractors on a fixed schedule." },
];

export default function Dashboard() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-bg text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="dashboard" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-10 top-8 h-40 w-40 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            {/* Header */}
            <div className="mb-8 pb-8 border-b border-[#2a2a26]">
              <div className="mb-3 h-1 w-12 rounded-full bg-mint shadow-[0_0_24px_rgba(187,235,225,0.45)]" />
              <h1 className="text-5xl font-bold tracking-tight text-cream">Dashboard</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                Welcome to ONYX. Create your first contract to start moving money programmatically.
              </p>
            </div>

            {/* Summary cards — gradient */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className={`rounded-3xl border border-[#2a2a26] border-t-2 border-mint/20 bg-gradient-to-br ${card.gradient} bg-surface p-7 transition-all hover:border-mint/40 hover:-translate-y-0.5`}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10">
                      <Icon className="h-6 w-6 text-mint" />
                    </div>
                    <p className="mb-2 text-sm font-medium text-muted">{card.label}</p>
                    <p className="text-4xl font-bold tracking-tight text-cream">{card.value}</p>
                    <p className="mt-1 text-xs text-muted/60">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent activity */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">Recent</p>
                  <h2 className="mt-1 text-xl font-bold text-cream">Activity</h2>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/activity")}
                  className="flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-cream"
                >
                  View all <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <div className="rounded-2xl border border-[#2a2a26] bg-surface p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/10">
                  <FileText className="h-7 w-7 text-mint" />
                </div>
                <p className="text-base font-semibold text-cream">No activity yet</p>
                <p className="mt-1.5 text-sm text-muted">Your transactions will appear here once you start.</p>
              </div>
            </section>

            {/* Quick start */}
            <section>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">Quick start</p>
                <h2 className="mt-1 text-2xl font-bold text-cream">Choose a contract type</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {quickStart.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="group rounded-3xl border border-[#2a2a26] bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-mint/50"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-cream">{item.title}</h3>
                      <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{item.description}</p>
                      <button
                        type="button"
                        onClick={() => router.push(item.href)}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mint transition-all group-hover:gap-2.5"
                      >
                        Create
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
