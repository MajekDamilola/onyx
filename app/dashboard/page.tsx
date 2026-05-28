"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowUpRight,
  FileText,
  GitBranch,
  Lock,
  Plus,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const summaryCards = [
  { label: "Total Locked", value: "$0.00", sub: "across all contracts", icon: Lock },
  { label: "Total Sent", value: "$0.00", sub: "this month", icon: ArrowUpRight },
  { label: "Active Contracts", value: "0", sub: "contracts running", icon: FileText },
];

const quickStart = [
  {
    title: "Escrow",
    href: "/escrow",
    icon: Shield,
    description: "Lock funds with a 48-hour dispute window.",
  },
  {
    title: "AutoPay",
    href: "/autopay",
    icon: RefreshCw,
    description: "Schedule recurring wallet payments.",
  },
  {
    title: "Split",
    href: "/split",
    icon: GitBranch,
    description: "Create an address that distributes instantly.",
  },
  {
    title: "Payroll",
    href: "/payroll",
    icon: Users,
    description: "Pay contractors on a fixed schedule.",
  },
];

export default function Dashboard() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
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
            <div className="mb-9">
              <div className="mb-4 h-1 w-14 rounded-full bg-mint shadow-[0_0_24px_rgba(187,235,225,0.45)]" />
              <h1 className="text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                Welcome to ONYX. Create your first contract to start moving money programmatically.
              </p>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36]"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mb-1 text-sm text-muted">{card.label}</p>
                    <p className="mb-1 text-3xl font-bold text-cream">{card.value}</p>
                    <p className="text-xs text-muted">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            <section className="rounded-3xl border border-[#2a2a26] bg-surface p-8 text-center transition-colors hover:border-[#3a3a36] sm:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mint/10 text-mint">
                <FileText className="h-10 w-10" />
              </div>
              <p className="mb-3 text-2xl font-bold text-cream">No contracts yet</p>
              <p className="mx-auto mb-7 max-w-lg text-sm leading-6 text-muted">
                Your programmable money flows will appear here once you create an escrow,
                payment schedule, split, or payroll run.
              </p>
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">
                    Quick start
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-cream">Choose a contract type</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {quickStart.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-3xl border border-[#2a2a26] bg-surface p-5 transition-colors hover:border-[#3a3a36]"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-cream">{item.title}</h3>
                      <p className="mt-2 min-h-12 text-sm leading-6 text-muted">{item.description}</p>
                      <button
                        type="button"
                        onClick={() => router.push(item.href)}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-bold text-bg transition-colors hover:bg-cream"
                      >
                        <Plus className="h-4 w-4" />
                        Create
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
