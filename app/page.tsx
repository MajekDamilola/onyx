"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  ArrowRight,
  GitBranch,
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
    description: "Deposit USDC or USDT",
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
    description: "Lock funds, release when work is done",
    badge: "Live on Sepolia",
  },
  {
    icon: RefreshCw,
    title: "AutoPay",
    description: "Never miss a bill again",
    badge: "Coming soon",
  },
  {
    icon: GitBranch,
    title: "Split",
    description: "Incoming money distributed instantly",
    badge: "Coming soon",
  },
  {
    icon: Users,
    title: "Payroll",
    description: "Pay your team on schedule, automatically",
    badge: "Coming soon",
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
            className="rounded-full border border-mint px-5 py-2.5 text-sm font-semibold text-mint transition hover:bg-mint hover:text-bg sm:px-6"
          >
            Launch App
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div className="absolute left-1/2 top-28 h-64 w-64 -translate-x-1/2 rounded-full bg-mint/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-mint">
            <Zap className="h-4 w-4" />
            Programmable money, no code required
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-cream sm:text-6xl lg:text-7xl">
            Money that moves itself.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            Escrow, autopay, revenue splits, payroll — programmable, on-chain,
            no code required.
          </p>
          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={login}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-7 py-3.5 text-base font-bold text-bg transition hover:bg-cream"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-base font-semibold text-cream transition hover:border-mint hover:text-mint"
            >
              See how it works
            </a>
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
                className="border-t border-border bg-surface px-6 py-8 transition hover:border-mint"
              >
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
                  className="border-t-2 border-mint bg-surface p-6 transition hover:bg-surface-2 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint/10 text-mint">
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
        <div className="mx-auto max-w-7xl bg-surface px-6 py-16 text-center sm:px-10 lg:px-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint/10 text-mint">
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
            className="mt-8 inline-flex items-center justify-center gap-2 text-base font-semibold text-mint transition hover:text-cream"
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
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-mint px-7 py-3.5 text-base font-bold text-bg transition hover:bg-cream"
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
