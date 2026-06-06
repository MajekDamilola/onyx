"use client";

import { Fragment } from "react";
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
  { title: "Create a contract", description: "Pick your type, set the rules" },
  { title: "Fund it", description: "Fund your contract with USDC or USDT on Sepolia" },
  { title: "Walk away", description: "ONYX handles everything automatically" },
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

const MARQUEE_ITEMS = [
  "Built on Rialo Network",
  "·",
  "$20M seed",
  "·",
  "Backed by Pantera Capital & Coinbase Ventures",
  "·",
  "Private devnet live",
  "·",
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
            onClick={authenticated ? () => (window.location.href = "/dashboard") : login}
            className="rounded-full border border-mint px-5 py-2.5 text-sm font-semibold text-mint transition-colors hover:bg-mint hover:text-bg sm:px-6"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-mint/8 blur-[140px]" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="mb-5 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-mint">
            <Zap className="h-4 w-4" />
            Programmable money, no code required
          </p>
          <h1 className="animate-fade-in-up delay-100 max-w-4xl text-6xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl bg-gradient-to-r from-cream via-mint to-cream bg-clip-text text-transparent animate-shimmer bg-[size:200%]">
            Money that moves itself.
          </h1>
          <p className="animate-fade-in-up delay-200 mt-8 max-w-3xl text-lg leading-8 text-muted sm:text-xl">
            Programmable money flows for the real world. Escrow, autopay, revenue splits, and payroll — all on-chain, trustless, and powered by Rialo Network.
          </p>
          <div className="animate-fade-in-up delay-300 mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
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

          {/* Network status pills */}
          <div className="mt-6 mb-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#2a2a26] bg-surface px-3 py-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Sepolia testnet · Live
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#2a2a26] bg-surface px-3 py-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Rialo testnet · Coming soon
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#2a2a26] bg-surface px-3 py-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-[#2a2a26]" />
              0 active contracts
            </div>
          </div>

          {/* Mock dashboard — fade in + float */}
          <div className="animate-fade-in-up delay-400 relative w-full max-w-5xl">
            <div className="animate-float rounded-3xl border border-[#2a2a26] bg-surface shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
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

      {/* Money flow SVG diagram */}
      <section className="overflow-x-auto px-5 py-16 sm:px-8">
        <div className="flex justify-center">
          <svg width="600" height="120" viewBox="0 0 600 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full">
            <rect x="20" y="35" width="100" height="50" rx="12" fill="#1c1c1a" stroke="#2a2a26" strokeWidth="1.5"/>
            <text x="70" y="55" textAnchor="middle" fill="#E8E3D5" fontSize="10" fontWeight="600">Client</text>
            <text x="70" y="72" textAnchor="middle" fill="#6b6760" fontSize="8">0x1234...5678</text>
            <line x1="125" y1="60" x2="240" y2="60" stroke="#2a2a26" strokeWidth="1.5" strokeDasharray="6 4"/>
            <circle cx="182" cy="60" r="4" fill="#BBEBE1" opacity="0.8">
              <animateMotion dur="2s" repeatCount="indefinite" path="M-57,0 L57,0"/>
            </circle>
            <rect x="245" y="25" width="110" height="70" rx="12" fill="#1c1c1a" stroke="#BBEBE1" strokeWidth="1.5" strokeOpacity="0.4"/>
            <text x="300" y="52" textAnchor="middle" fill="#BBEBE1" fontSize="10" fontWeight="700">ONYX</text>
            <text x="300" y="68" textAnchor="middle" fill="#6b6760" fontSize="8">Smart Contract</text>
            <text x="300" y="82" textAnchor="middle" fill="#6b6760" fontSize="7">IPC · REX · AutoPay</text>
            <line x1="360" y1="60" x2="475" y2="60" stroke="#2a2a26" strokeWidth="1.5" strokeDasharray="6 4"/>
            <circle cx="417" cy="60" r="4" fill="#BBEBE1" opacity="0.8">
              <animateMotion dur="2s" repeatCount="indefinite" begin="1s" path="M-57,0 L57,0"/>
            </circle>
            <rect x="480" y="35" width="100" height="50" rx="12" fill="#1c1c1a" stroke="#2a2a26" strokeWidth="1.5"/>
            <text x="530" y="55" textAnchor="middle" fill="#E8E3D5" fontSize="10" fontWeight="600">Freelancer</text>
            <text x="530" y="72" textAnchor="middle" fill="#6b6760" fontSize="8">0xabcd...efgh</text>
          </svg>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">How it works</p>
            <h2 className="mt-3 text-3xl font-bold text-cream sm:text-4xl">Set the rules once. Let ONYX execute.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {steps.map((step, index) => (
              <Fragment key={step.title}>
                <div className="relative min-h-[180px] overflow-hidden rounded-3xl border border-[#2a2a26] bg-surface p-8 transition-all duration-200 hover:border-[#3a3a36] hover:bg-surface-2">
                  <span className="pointer-events-none absolute bottom-2 right-4 select-none text-[120px] font-bold leading-none text-mint/[0.04]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-4xl font-bold text-mint">{String(index + 1).padStart(2, "0")}</span>
                  <div className="w-8 h-0.5 bg-mint/40 rounded-full mt-2 mb-6" />
                  <h3 className="text-xl font-semibold text-cream">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-2">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="text-mint/30 text-2xl hidden md:flex items-center">&rarr;</div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Contract types */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint/70">Contract types</p>
              <h2 className="mt-3 text-4xl font-bold text-cream tracking-tight">Workflows for money in motion.</h2>
              <div className="w-12 h-1 bg-mint rounded-full mt-3" />
            </div>
            <p className="max-w-md leading-7 text-muted">
              Start with escrow on Sepolia, then automate payments, splits, and payroll as the network expands.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {contracts.map((contract) => {
              const Icon = contract.icon;
              return (
                <article
                  key={contract.title}
                  className="hover-glow group rounded-3xl border border-[#2a2a26] border-t-2 border-mint bg-surface p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(187,235,225,0.08)]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-mint/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-mint" />
                    </div>
                    <span className={
                      contract.badge === "Live on Sepolia"
                        ? "bg-mint/15 text-mint border border-mint/30 rounded-full px-3 py-1 text-xs font-semibold"
                        : "bg-surface-2 text-muted border border-[#2a2a26] rounded-full px-3 py-1 text-xs font-medium"
                    }>
                      {contract.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-cream mt-6 mb-2">{contract.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{contract.description}</p>
                  <div className="mt-6 flex justify-end text-muted/40 text-sm transition-colors group-hover:text-mint">
                    &rarr;
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credibility strip / marquee */}
      <div className="border-y border-[#2a2a26] py-4 overflow-hidden">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={`text-xs text-muted/60 ${item === "·" ? "mx-4" : "mx-2"}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Built for the real world */}
      <section className="bg-surface border-y border-[#2a2a26] py-20 px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint/70 mb-4">Built for the real world</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream mb-4 max-w-2xl">
              Compliance, privacy, and real-world execution.
            </h2>
            <p className="text-muted text-base leading-relaxed max-w-xl mb-12">
              ONYX is designed for payment flows that need trust, privacy, and real-world signals built into the experience.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {realWorld.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex items-start gap-5 p-6 rounded-2xl border border-[#2a2a26] bg-bg hover:border-mint/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-mint/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-mint" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-cream">{item.title}</h3>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <p className="bg-surface-2 border border-[#2a2a26] rounded-full px-3 py-1 text-xs text-muted whitespace-nowrap">
                    Coming on Rialo testnet
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built on Rialo Network */}
      <section className="px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#2a2a26] bg-surface mx-auto max-w-7xl py-16 px-8 text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[200px] bg-mint/5 blur-[80px] rounded-full" />
          </div>
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-mint/10 flex items-center justify-center mx-auto mb-6 animate-pulse-mint">
              <Zap className="h-8 w-8 text-mint" />
            </div>
            <h2 className="text-3xl font-bold text-cream mb-4">Built on Rialo Network</h2>
            <p className="text-base text-muted leading-relaxed max-w-lg mx-auto">
              Rialo enables self-executing contracts, native HTTP calls, and confidential computing so money flows can run without manual intervention.
            </p>
            <div className="mt-4 mb-6 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs text-muted/60">
                Rialo devnet is live · Compliant stablecoin and recurring payments already running on devnet
              </p>
            </div>
            <a
              href="https://rialo.io"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-mint font-semibold hover:text-cream transition-colors text-base"
            >
              Visit rialo.io
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="relative overflow-hidden bg-bg border-t border-[#2a2a26] px-5 py-16 sm:px-8">
        <div className="absolute w-[500px] h-[200px] bg-mint/8 blur-[100px] rounded-full -translate-x-1/2 left-1/2" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-cream text-center">
            Build your first contract in 2 minutes
          </h2>
          <p className="text-muted text-base mt-4 mb-8 text-center max-w-md mx-auto">
            Join the builders shaping the future of programmable money on Rialo Network.
          </p>
          <button
            type="button"
            onClick={login}
            className="inline-flex items-center gap-2 bg-mint text-bg font-bold rounded-full px-8 py-4 text-base hover:bg-cream transition-colors hover:shadow-[0_0_30px_rgba(187,235,225,0.2)]"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-muted mt-6">
            No wallet required to get started · Powered by Rialo Network
          </p>
          <p className="text-sm text-muted/50 mt-12">ONYX · Powered by Rialo</p>
        </div>
      </footer>
    </main>
  );
}
