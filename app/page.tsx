"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  ArrowRight,
  GitBranch,
  Globe2,
  LockKeyhole,
  RefreshCw,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const steps = [
  {
    title: "Create a contract",
    description: "Pick your type, set the rules",
  },
  {
    title: "Fund it",
    description: "Fund your contract with USDC or USDT on Sepolia",
  },
  {
    title: "Walk away",
    description: "ONYX handles everything automatically",
  },
];

const contracts = [
  {
    icon: Shield,
    title: "Escrow",
    description: "Lock funds for a contractor. Releases automatically after a 48-hour dispute window when work is delivered.",
    badge: "Live on Sepolia",
  },
  {
    icon: RefreshCw,
    title: "AutoPay",
    description: "Schedule recurring payments to any Rialo wallet. Set it once, fund it, walk away.",
    badge: "Coming soon",
  },
  {
    icon: GitBranch,
    title: "Split",
    description: "Create a shared payment address. Any USDC or USDT sent to it distributes instantly to all parties.",
    badge: "Coming soon",
  },
  {
    icon: Users,
    title: "Payroll",
    description: "Pay your remote team in USDC or USDT on a set schedule. One approval, instant distribution.",
    badge: "Coming soon",
  },
];

const realWorld = [
  {
    icon: Shield,
    title: "Compliance by default",
    description: "Rialo IPC screens every transaction for sanctions compliance automatically",
  },
  {
    icon: LockKeyhole,
    title: "Private contract terms",
    description: "REX keeps your payment amounts and contract terms private on-chain",
  },
  {
    icon: Globe2,
    title: "Native real-world triggers",
    description: "Native HTTP calls let contracts react to real-world events without oracles",
  },
];

export default function Home() {
  const { login, authenticated } = usePrivy();

  return (
    <main className="min-h-screen bg-bg text-cream">
      <nav className="sticky top-0 z-50 border-b border-border/80 bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="text-2xl font-bold tracking-wide text-cream sm:text-3xl">
            ONYX
          </a>
          <button
            type="button"
            onClick={authenticated ? () => window.location.href = "/dashboard" : login}
            className="rounded-full border border-mint px-5 py-2.5 text-sm font-semibold text-mint transition-colors hover:bg-mint hover:text-bg sm:px-6"
          >
            Launch App
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-mint/8 blur-[140px]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-mint">
            <Zap className="h-4 w-4" />
            Programmable money, no code required
          </p>
          <h1 className="max-w-4xl text-6xl font-bold leading-[1.05] tracking-tight text-cream drop-shadow-[0_0_24px_rgba(187,235,225,0.15)] sm:text-7xl lg:text-8xl">
            Money that moves itself.
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-muted sm:text-xl">
            Programmable money flows for the real world. Escrow, autopay, revenue splits, and payroll — all on-chain, trustless, and powered by Rialo Network.
          </p>
          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={login}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-7 py-3.5 text-base font-bold text-bg transition-colors hover:bg-cream"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-base font-semibold text-muted transition-colors hover:border-mint hover:text-cream"
            >
              See how it works
            </a>
          </div>

          <div className="relative mt-16 w-full max-w-5xl">
            <div className="rounded-3xl border border-[#2a2a26] bg-surface shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
              <div className="flex h-11 items-center gap-2 border-b border-[#2a2a26] px-5">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-300/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="grid min-h-[300px] grid-cols-[88px_1fr] overflow-hidden sm:grid-cols-[180px_1fr]">
                <div className="border-r border-[#2a2a26] bg-bg/70 p-4">
                  <div className="mb-6 h-7 w-20 rounded-lg bg-mint/15" />
                  <div className="space-y-3">
                    {["Dashboard", "Escrow", "AutoPay", "Payroll"].map((item, index) => (
                      <div
                        key={item}
                        className={`flex h-9 items-center gap-3 rounded-xl px-3 ${
                          index === 0 ? "bg-surface-2 text-cream" : "text-muted"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${index === 0 ? "bg-mint" : "bg-[#2a2a26]"}`} />
                        <span className="hidden text-sm sm:inline">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#171716] p-5 sm:p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="h-8 w-36 rounded-xl bg-cream/10" />
                      <div className="mt-3 h-3 w-56 max-w-full rounded-full bg-muted/20" />
                    </div>
                    <div className="hidden h-10 w-28 rounded-full bg-mint sm:block" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      ["Total Locked", "$0.00"],
                      ["Total Sent", "$0.00"],
                      ["Active Contracts", "0"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-[#2a2a26] border-t-2 border-t-mint/40 bg-surface p-5 text-left">
                        <div className="mb-5 h-10 w-10 rounded-2xl bg-mint/10" />
                        <p className="text-xs text-muted">{label}</p>
                        <p className="mt-2 text-2xl font-bold text-cream">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl border border-[#2a2a26] bg-surface p-5">
                    <div className="mx-auto h-16 w-16 rounded-3xl bg-mint/10" />
                    <div className="mx-auto mt-5 h-4 w-44 rounded-full bg-cream/10" />
                    <div className="mx-auto mt-3 h-3 w-64 max-w-full rounded-full bg-muted/20" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-cream sm:text-4xl">
              Set the rules once. Let ONYX execute.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative overflow-hidden rounded-3xl border border-[#2a2a26] bg-surface px-6 py-8 transition-colors hover:border-[#3a3a36]"
              >
                <span className="pointer-events-none absolute bottom-2 right-4 select-none text-[120px] font-bold leading-none text-mint/5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-5xl font-bold text-mint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 text-2xl font-semibold text-cream">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">
                Contract types
              </p>
              <h2 className="mt-3 text-3xl font-bold text-cream sm:text-4xl">
                Workflows for money in motion.
              </h2>
            </div>
            <p className="max-w-md leading-7 text-muted">
              Start with escrow on Sepolia, then automate payments, splits, and
              payroll as the network expands.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {contracts.map((contract) => {
              const Icon = contract.icon;

              return (
                <article
                  key={contract.title}
                  className="rounded-3xl border border-[#2a2a26] border-t-2 border-t-mint bg-surface p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[#3a3a36] hover:border-t-mint sm:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-mint">
                      {contract.badge}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-cream">
                    {contract.title}
                  </h3>
                  <p className="mt-3 text-lg leading-7 text-muted">
                    {contract.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">
              Built for the real world
            </p>
            <h2 className="mt-3 text-3xl font-bold text-cream drop-shadow-[0_0_18px_rgba(187,235,225,0.18)] sm:text-4xl">
              Compliance, privacy, and real-world execution.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {realWorld.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36] sm:p-8"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-cream">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                  <p className="mt-6 text-xs font-medium text-muted">
                    Coming on Rialo mainnet
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#2a2a26] bg-surface px-6 py-16 text-center transition-colors hover:border-[#3a3a36] sm:px-10 lg:px-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/10 text-mint">
            <Zap className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-cream sm:text-4xl">
            Built on Rialo Network
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted">
            Rialo enables self-executing contracts, native HTTP calls, and
            confidential computing so money flows can run without manual
            intervention.
          </p>
          <p className="mt-6 text-sm font-medium text-muted">
            Full automation unlocks on Rialo mainnet
          </p>
          <a
            href="https://rialo.io"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 text-base font-semibold text-mint transition-colors hover:text-cream"
          >
            Visit rialo.io
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-cream sm:text-5xl">
            Build your first contract in 2 minutes
          </h2>
          <button
            type="button"
            onClick={login}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-mint px-7 py-3.5 text-base font-bold text-bg transition-colors hover:bg-cream"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-12 text-sm font-medium text-muted">
            ONYX · Powered by Rialo
          </p>
        </div>
      </footer>
    </main>
  );
}
