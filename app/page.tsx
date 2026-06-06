"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  CheckCircle,
  Copy,
  GitBranch,
  Lock,
  RefreshCw,
  Shield,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export default function Home() {
  const { login, authenticated } = usePrivy();

  const launchApp = () => {
    if (authenticated) {
      window.location.href = "/dashboard";
    } else {
      login();
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg text-cream">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
            <a href="#" className="text-xl font-bold tracking-tight text-white">ONYX</a>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="/docs" className="text-sm text-muted transition-colors hover:text-white">Docs</a>
            <a href="#features" className="text-sm text-muted transition-colors hover:text-white">Features</a>
            <a href="#" className="text-sm text-muted transition-colors hover:text-white">Pricing</a>
          </div>
          <button
            type="button"
            onClick={launchApp}
            className="rounded-full border border-white/20 px-5 py-2 text-sm text-white transition-all hover:bg-white hover:text-black"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-5 py-20 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/5 blur-[160px]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left — text */}
            <div>
              <div className="mb-6 inline-flex animate-fade-in items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
                <span className="text-xs font-medium tracking-wide text-mint">Live on Sepolia testnet</span>
              </div>

              <h1 className="animate-fade-in-up delay-1 text-5xl font-black leading-[1.05] tracking-tight text-white lg:text-7xl">
                The programmable payment layer for the real world.
              </h1>

              <p className="animate-fade-in-up delay-2 mt-6 max-w-lg text-lg leading-relaxed text-muted">
                Escrow, autopay, splits, and payroll — all on-chain, trustless, and powered by Rialo Network. Set the rules once. Money moves itself.
              </p>

              <div className="animate-fade-in-up delay-3 mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={login}
                  className="rounded-full bg-mint px-7 py-3.5 text-base font-bold text-black transition-colors hover:bg-white"
                >
                  Start for free →
                </button>
                <a
                  href="/docs"
                  className="rounded-full border border-white/20 px-7 py-3.5 text-base text-white transition-colors hover:border-white"
                >
                  Visit docs →
                </a>
              </div>

              <div className="animate-fade-in-up delay-4 mt-6 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  Sepolia testnet · Live
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Rialo testnet · Coming soon
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">
                  <span className="h-2 w-2 rounded-full bg-mint" />
                  Email login · No wallet needed
                </div>
              </div>
            </div>

            {/* Right — dashboard mock */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-96 w-96 rounded-full bg-mint/10 blur-[100px]" />
              </div>
              <div className="relative animate-float overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
                {/* Topbar */}
                <div className="flex h-12 items-center justify-between border-b border-white/5 px-5">
                  <span className="text-sm font-bold text-white">ONYX</span>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <Wallet className="h-3.5 w-3.5 text-mint" />
                    <span className="font-mono text-xs text-muted">0x1234...5678</span>
                  </div>
                </div>
                {/* Metric cards */}
                <div className="grid grid-cols-3 gap-3 p-5">
                  {[["Total Locked","$0.00"],["Total Sent","$0.00"],["Active Contracts","0"]].map(([label,value]) => (
                    <div key={label} className="rounded-xl border border-white/5 bg-white/5 p-3">
                      <p className="text-xs text-muted">{label}</p>
                      <p className="mt-1.5 text-base font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                {/* Contract type pills */}
                <div className="px-5 pb-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Contract types</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Shield,    label: "Escrow",  color: "text-mint",      bg: "bg-mint/10" },
                      { icon: RefreshCw, label: "AutoPay", color: "text-purple-400", bg: "bg-purple-400/10" },
                      { icon: GitBranch, label: "Split",   color: "text-blue-400",  bg: "bg-blue-400/10" },
                      { icon: Users,     label: "Payroll", color: "text-amber-400", bg: "bg-amber-400/10" },
                    ].map(({ icon: Icon, label, color, bg }) => (
                      <div key={label} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <span className="text-sm font-medium text-white">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE SECTIONS ───────────────────────────────────────────── */}
      <div id="features">

        {/* 01 — ESCROW */}
        <div className="border-t border-white/5" />
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Text */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">01 · Escrow</p>
                <h2 className="text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
                  Lock funds. Release when work is done.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Create an escrow contract in seconds. Funds lock on-chain. The freelancer delivers, marks complete, and payment releases automatically after a 48-hour dispute window. No middleman. No trust required.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["GitHub PR merge", "Google Drive delivery", "48hr dispute window"].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1.5 text-xs text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Rialo testnet · Auto-detection
                </div>
              </div>
              {/* Mock */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-64 rounded-full bg-mint/10 blur-[80px]" />
                </div>
                <div className="relative rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Escrow Contract</p>
                      <h3 className="mt-1 font-semibold text-white">Website Redesign · M1</h3>
                      <p className="mt-0.5 font-mono text-xs text-muted">0x1234...5678</p>
                    </div>
                    <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">Active</span>
                  </div>
                  <div className="my-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xs text-muted">Locked</p>
                      <p className="mt-1 font-bold text-white">500 USDC</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xs text-muted">Dispute window</p>
                      <p className="mt-1 font-bold text-white">48 hours</p>
                    </div>
                  </div>
                  <p className="mb-4 text-xs leading-relaxed text-muted">
                    Milestone: Complete homepage design and deliver Figma files
                  </p>
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 rounded-xl border border-mint/40 py-2.5 text-xs font-semibold text-mint">Mark Complete</button>
                    <button type="button" className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-muted">Open Dispute</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — AUTOPAY */}
        <div className="border-t border-white/5" />
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Mock — left on desktop */}
              <div className="relative order-2 lg:order-1">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]" />
                </div>
                <div className="relative rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                        <RefreshCw className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Team Retainer</p>
                        <p className="text-xs text-muted">Monthly · Next: Feb 1</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">Active</span>
                  </div>
                  <div className="mb-4 rounded-xl bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted">Amount per cycle</p>
                      <p className="text-lg font-bold text-white">800 USDC</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <p className="text-xs text-muted">Vault balance</p>
                    <p className="font-semibold text-white">$2,400.00</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-muted">Next payment</p>
                    <p className="text-xs text-white">Feb 1, 2026</p>
                  </div>
                </div>
              </div>
              {/* Text — right on desktop */}
              <div className="order-1 lg:order-2">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">02 · AutoPay</p>
                <h2 className="text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
                  Set it once. Never miss a payment.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Schedule recurring payments to any Rialo wallet. Fund your vault once and ONYX executes payments automatically on your set schedule. Weekly, biweekly, or monthly.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Schedule-based", "Vault funding", "Pause anytime"].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-xs text-purple-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Rialo testnet · Self-executing payments
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — SPLIT */}
        <div className="border-t border-white/5" />
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Text */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">03 · Split</p>
                <h2 className="text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
                  One address. Instant distribution.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Create a shared payment address. Any USDC or USDT sent to it automatically splits between all parties based on pre-set percentages. No manual transfers, no disputes over who gets what.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Instant split", "Up to 10 parties", "Private via REX"].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Rialo testnet · REX privacy
                </div>
              </div>
              {/* Mock */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />
                </div>
                <div className="relative rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">Split Contract</p>
                    <h3 className="mt-1 font-semibold text-white">Agency Revenue Split</h3>
                  </div>
                  <div className="mb-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <p className="font-mono text-xs text-muted">0x7f9a...3c2d</p>
                    <Copy className="h-4 w-4 text-muted" />
                  </div>
                  <div className="mb-4 space-y-2">
                    {[["Alice", "60%"], ["Bob", "40%"]].map(([name, pct]) => (
                      <div key={name} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                        <p className="text-sm text-white">{name}</p>
                        <p className="font-bold text-mint">{pct}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <p className="text-xs text-muted">Total received</p>
                    <p className="font-bold text-white">0.00 USDC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — PAYROLL */}
        <div className="border-t border-white/5" />
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Mock — left on desktop */}
              <div className="relative order-2 lg:order-1">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />
                </div>
                <div className="relative rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Payroll</p>
                      <h3 className="mt-1 font-semibold text-white">Engineering Team</h3>
                      <p className="mt-0.5 text-xs text-muted">Monthly · Next: Feb 1</p>
                    </div>
                    <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">Active</span>
                  </div>
                  <div className="mb-5 space-y-2">
                    {[
                      { name: "Sarah Chen",  role: "Frontend", amount: "900 USDC"   },
                      { name: "Marcus Roy",  role: "Backend",  amount: "1,200 USDC" },
                      { name: "Priya Nair",  role: "Design",   amount: "800 USDC"   },
                    ].map((c) => (
                      <div key={c.name} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">{c.name}</p>
                          <p className="text-xs text-muted">{c.role}</p>
                        </div>
                        <p className="text-sm font-semibold text-white">{c.amount}</p>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-mint py-3 text-sm font-bold text-black">
                    <CheckCircle className="h-4 w-4" />
                    Approve & Pay · 2,900 USDC
                  </button>
                </div>
              </div>
              {/* Text */}
              <div className="order-1 lg:order-2">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">04 · Payroll</p>
                <h2 className="text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
                  Pay your team in one click.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Add your contractors, set the schedule, and approve each cycle. ONYX distributes payments to all wallets simultaneously in seconds. Global team, instant pay, no fees.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Multi-wallet", "USDC & USDT", "One approval"].map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Rialo testnet · Private salaries via REX
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── RIALO NETWORK ──────────────────────────────────────────────── */}
      <div className="border-t border-white/5" />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Built on Rialo Network</p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-white lg:text-5xl">
              Compliance, privacy, and automation —<br className="hidden sm:block" /> built into the protocol.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Compliance by default",
                body: "Rialo IPC screens every transaction for sanctions compliance automatically. No manual checks, no third parties.",
              },
              {
                icon: Lock,
                title: "Private by default",
                body: "REX keeps payment amounts and contract terms encrypted on-chain. Only the parties involved can see the details.",
              },
              {
                icon: Zap,
                title: "Automated execution",
                body: "Native HTTP calls let contracts react to real-world events — GitHub merges, file deliveries, API triggers — without oracles.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10">
                  <Icon className="h-5 w-5 text-mint" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Coming on Rialo testnet
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <p className="text-xs text-muted/60">
              Rialo devnet is live · Compliant stablecoin and recurring payments already running on devnet
            </p>
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY ────────────────────────────────────────────────── */}
      <div className="border-t border-white/5" />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-white">Built for the Rialo ecosystem</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              ONYX is one of the first full-stack applications being built for Rialo Network — demonstrating real-world utility of IPC compliance, REX privacy, and native web connectivity.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Email login",
                body: "No wallet setup. Sign in with email and get a wallet automatically via Privy.",
              },
              {
                title: "Sepolia testnet",
                body: "Real transactions running on Ethereum Sepolia testnet. Test with real USDC and USDT.",
              },
              {
                title: "Rialo-native",
                body: "Built to leverage every Rialo primitive — IPC, REX, native HTTP — when testnet launches.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="mb-2 font-semibold text-white">{title}</p>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <div className="border-t border-white/5" />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-5xl font-black tracking-tight text-white">
            Start moving money programmatically.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            No wallet required. Sign in with email and create your first contract in under 2 minutes.
          </p>
          <button
            type="button"
            onClick={login}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mint px-8 py-4 text-base font-bold text-black transition-colors hover:bg-white"
          >
            Start for free →
          </button>
          <p className="mt-5 text-xs text-muted">
            Free to use · No wallet required · Powered by Rialo Network
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-mint" />
                <p className="font-bold text-white">ONYX</p>
              </div>
              <p className="mt-1 text-xs text-muted">Powered by Rialo Network</p>
            </div>
            <div className="flex gap-6">
              {["Docs", "GitHub", "Twitter", "Discord"].map((link) => (
                <a key={link} href="#" className="text-sm text-muted transition-colors hover:text-white">{link}</a>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-8">
            <p className="text-xs text-muted/40">© 2026 ONYX · Built on Rialo Network</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
