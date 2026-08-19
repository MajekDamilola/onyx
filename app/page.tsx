"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import OnyxMark from "@/components/OnyxMark";

const GITHUB_URL = "https://github.com/MajekDamilola/onyx";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
      {children}
    </p>
  );
}

function SectionDivider() {
  return <div className="border-t border-border-subtle" />;
}

function EnvDot({ tone }: { tone: "live" | "soon" | "info" }) {
  const color = tone === "live" ? "bg-success" : tone === "soon" ? "bg-warning" : "bg-mint";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} />;
}

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

      {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border-subtle bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2">
            <OnyxMark className="h-4 w-4 text-mint" />
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-cream">ONYX</span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#primitives" className="text-[13px] text-muted transition-colors hover:text-cream">Platform</a>
            <a href="#control" className="text-[13px] text-muted transition-colors hover:text-cream">Solutions</a>
            <a href="#developers" className="text-[13px] text-muted transition-colors hover:text-cream">Developers</a>
            <a href="/docs" className="text-[13px] text-muted transition-colors hover:text-cream">Resources</a>
          </div>
          <div className="flex items-center gap-5">
            <a href="/docs" className="hidden text-[13px] text-muted transition-colors hover:text-cream sm:block">
              Documentation
            </a>
            <button
              type="button"
              onClick={launchApp}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-mint px-4 py-2 text-[13px] font-semibold text-bg transition-colors hover:bg-white"
            >
              Launch Console
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 items-start gap-16 xl:grid-cols-[minmax(0,1fr)_780px] xl:gap-10">

            {/* Left — copy */}
            <div className="animate-fade-in-up max-w-xl">
              <Eyebrow>Programmable payment infrastructure</Eyebrow>

              <h1 className="text-[42px] font-black leading-[1.05] tracking-tight text-cream sm:text-[56px] lg:text-[64px]">
                Money moves according to your rules.
              </h1>

              <p className="mt-6 text-base leading-relaxed text-muted">
                Escrow, recurring payments, payroll and revenue distribution — programmable
                on-chain through ONYX. Define who gets paid, when, how much, and under what
                conditions. ONYX executes the rules and settles automatically.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={launchApp}
                  className="inline-flex items-center gap-2 rounded-[9px] bg-mint px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-white"
                >
                  Launch Console
                  <ChevronRight className="h-4 w-4" />
                </button>
                <a
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-[9px] border border-border px-6 py-3 text-sm font-medium text-cream transition-colors hover:border-muted-2"
                >
                  Explore Documentation
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 flex flex-col gap-2.5 border-t border-border-subtle pt-6 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <EnvDot tone="live" />
                  Sepolia testnet — Live
                </div>
                <div className="flex items-center gap-2">
                  <EnvDot tone="soon" />
                  Rialo network — Coming soon
                </div>
                <div className="flex items-center gap-2">
                  <EnvDot tone="info" />
                  Email login — No wallet required
                </div>
              </div>
            </div>

            {/* Right — financial operations console */}
            <div className="animate-fade-in-up delay-2 overflow-hidden rounded-[16px] border border-border bg-surface shadow-[0_24px_80px_-24px_rgba(0,0,0,0.6)]">
              {/* Top command bar */}
              <div className="flex h-12 items-center justify-between border-b border-border px-4">
                <div className="flex items-center gap-2">
                  <OnyxMark className="h-3.5 w-3.5 text-mint" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream">ONYX</span>
                </div>
                <div className="hidden items-center gap-2 rounded-[6px] border border-border-subtle bg-surface-2 px-2.5 py-1 text-[11px] text-muted sm:flex">
                  <Search className="h-3 w-3" />
                  Search
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden items-center gap-1.5 rounded-[6px] border border-border-subtle bg-surface-2 px-2 py-1 text-[10px] text-muted sm:flex">
                    <EnvDot tone="live" />
                    Sepolia
                  </span>
                  <Bell className="h-3.5 w-3.5 text-muted" />
                  <div className="h-6 w-6 rounded-full bg-surface-3" />
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="hidden w-40 shrink-0 flex-col border-r border-border py-4 sm:flex">
                  <div className="flex flex-col gap-0.5 px-3">
                    {[
                      { label: "Overview", active: true },
                      { label: "Payments" },
                      { label: "Contracts" },
                      { label: "Treasury" },
                      { label: "Payroll" },
                      { label: "Splits" },
                      { label: "Activity" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-[6px] px-2.5 py-1.5 text-[11px] font-medium ${
                          item.active ? "bg-surface-2 text-cream" : "text-muted"
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border-subtle px-3 pt-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="rounded-[6px] px-2.5 py-1.5 text-[11px] font-medium text-muted">Developers</div>
                      <div className="rounded-[6px] px-2.5 py-1.5 text-[11px] font-medium text-muted">Settings</div>
                    </div>
                  </div>
                  <div className="mt-auto px-3 pt-4">
                    <div className="rounded-[6px] border border-border-subtle bg-surface-2 px-2.5 py-2">
                      <p className="flex items-center gap-1.5 text-[10px] text-muted">
                        <EnvDot tone="live" />
                        Sepolia Testnet
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-2">0x1234...5678</p>
                    </div>
                  </div>
                </div>

                {/* Main */}
                <div className="min-w-0 flex-1 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Treasury overview</p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="tabular-nums text-[28px] font-black tracking-tight text-cream sm:text-[32px]">
                      $2,480,392.18
                    </p>
                    <span className="flex items-center gap-1 rounded-[6px] bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                      <ArrowUpRight className="h-3 w-3" />
                      12.4%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-2">Available balance</p>

                  <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {[
                      ["Total volume", "$8.42M"],
                      ["Active contracts", "184"],
                      ["Pending settlement", "12"],
                      ["Success rate", "99.98%"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[10px] border border-border-subtle bg-surface-2 p-3">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-muted-2">{label}</p>
                        <p className="mt-1.5 tabular-nums text-sm font-bold text-cream">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[10px] border border-border-subtle bg-surface-2 p-4">
                    <p className="text-[9px] uppercase tracking-[0.1em] text-muted-2">Transaction volume</p>
                    <svg viewBox="0 0 300 64" className="mt-2 h-14 w-full" preserveAspectRatio="none">
                      <polyline
                        points="0,48 30,42 60,50 90,30 120,36 150,18 180,26 210,14 240,20 270,8 300,12"
                        fill="none"
                        stroke="var(--mint)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                    </svg>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.1em] text-muted-2">Recent activity</p>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { type: "Escrow", label: "Website Redesign", amount: "$4,200", status: "Settled" },
                        { type: "Payroll", label: "Engineering Team", amount: "$2,900", status: "Processing" },
                        { type: "Split", label: "Agency Revenue", amount: "$18,400", status: "Settled" },
                        { type: "AutoPay", label: "Infrastructure", amount: "$800", status: "Scheduled" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between rounded-[8px] border border-border-subtle px-3 py-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="shrink-0 rounded-[4px] bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-muted">
                              {row.type}
                            </span>
                            <span className="truncate text-[11px] text-cream">{row.label}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2.5">
                            <span className="tabular-nums text-[11px] font-semibold text-cream">{row.amount}</span>
                            <span
                              className={`text-[9px] font-medium uppercase tracking-[0.06em] ${
                                row.status === "Settled"
                                  ? "text-success"
                                  : row.status === "Processing"
                                  ? "text-warning"
                                  : "text-info"
                              }`}
                            >
                              {row.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ────────────────────────────────────────────────── */}
      <SectionDivider />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              Payments were built for transactions.
              <br />
              Businesses need rules.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Manual approval, manual reconciliation, recurring payment administration, routing,
              and dispute handling all add operational overhead that scales with every new
              counterparty.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[14px] border border-border-subtle bg-surface p-7">
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">Manual workflow</p>
              <div className="flex flex-col">
                {["Request", "Approval", "Payment", "Reconciliation", "Reporting"].map((step, i, arr) => (
                  <div key={step} className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[10px] font-semibold text-muted">
                        {i + 1}
                      </span>
                      {i < arr.length - 1 && <span className="h-8 w-px bg-border" />}
                    </div>
                    <p className="pt-0.5 text-sm text-muted">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[14px] border border-mint/25 bg-surface p-7">
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-mint">With ONYX</p>
              <div className="flex flex-col">
                {["Define rule", "Fund contract", "Automatic execution", "Settlement", "Audit trail"].map((step, i, arr) => (
                  <div key={step} className="flex items-start gap-3.5">
                    <div className="flex flex-col items-center">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-mint/40 bg-mint/10 text-[10px] font-semibold text-mint">
                        {i + 1}
                      </span>
                      {i < arr.length - 1 && <span className="h-8 w-px bg-mint/25" />}
                    </div>
                    <p className="pt-0.5 text-sm font-medium text-cream">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE ONYX MODEL ─────────────────────────────────────────────── */}
      <SectionDivider />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>The ONYX model</Eyebrow>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              Define once. Execute automatically.
            </h2>
          </div>

          <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-center lg:gap-0">
            {["Who", "When", "How much", "Under what conditions"].map((label, i) => (
              <div key={label} className="flex items-center gap-2 lg:contents">
                <div className="flex-1 rounded-[10px] border border-border bg-surface px-4 py-3.5 text-center lg:flex-initial lg:w-40">
                  <p className="text-sm font-semibold text-cream">{label}</p>
                </div>
                <div className="flex shrink-0 items-center justify-center lg:w-10">
                  <ChevronRight className="h-4 w-4 rotate-90 text-muted-2 lg:rotate-0" />
                </div>
                {i === 3 && (
                  <>
                    <div className="flex-1 rounded-[10px] border border-mint/40 bg-mint/10 px-4 py-3.5 text-center lg:flex-initial lg:w-32">
                      <p className="text-sm font-bold text-mint">ONYX</p>
                    </div>
                    <div className="flex shrink-0 items-center justify-center lg:w-10">
                      <ChevronRight className="h-4 w-4 rotate-90 text-muted-2 lg:rotate-0" />
                    </div>
                    <div className="flex-1 rounded-[10px] border border-border bg-surface-2 px-4 py-3.5 text-center lg:flex-initial lg:w-40">
                      <p className="text-sm font-semibold text-cream">Execution</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUR PAYMENT PRIMITIVES ────────────────────────────────────── */}
      <SectionDivider />
      <div id="primitives">
        <section className="px-5 pb-8 pt-24 sm:px-8">
          <div className="mx-auto max-w-[1400px] text-center">
            <Eyebrow>Payment primitives</Eyebrow>
            <h2 className="mx-auto max-w-2xl text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              One infrastructure. Four payment primitives.
            </h2>
          </div>
        </section>

        {/* 01 — ESCROW */}
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-2">01 · Escrow</p>
                <h3 className="text-3xl font-black leading-tight tracking-tight text-cream lg:text-4xl">
                  Lock funds. Release when work is done.
                </h3>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Create programmable escrow contracts with milestones, delivery conditions and
                  dispute windows. Funds lock on-chain until the condition is verified.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["GitHub PR merge", "Google Drive delivery", "48hr dispute window"].map((tag) => (
                    <span key={tag} className="rounded-[6px] border border-border bg-surface px-2.5 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-border bg-surface px-2.5 py-1.5 text-xs text-muted">
                  <EnvDot tone="soon" />
                  Rialo testnet · Auto-detection
                </div>
              </div>
              <div className="rounded-[14px] border border-border bg-surface p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-2">Escrow contract</p>
                    <h4 className="mt-1 font-semibold text-cream">Website Redesign · M1</h4>
                    <p className="mt-0.5 font-mono text-xs text-muted-2">0x1234...5678</p>
                  </div>
                  <span className="rounded-[6px] border border-mint/30 bg-mint/10 px-2.5 py-1 text-xs font-semibold text-mint">Active</span>
                </div>
                <div className="my-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[10px] bg-surface-2 p-3">
                    <p className="text-xs text-muted-2">Locked</p>
                    <p className="mt-1 tabular-nums font-bold text-cream">500 USDC</p>
                  </div>
                  <div className="rounded-[10px] bg-surface-2 p-3">
                    <p className="text-xs text-muted-2">Dispute window</p>
                    <p className="mt-1 font-bold text-cream">48 hours</p>
                  </div>
                </div>
                <p className="mb-5 text-xs leading-relaxed text-muted">
                  Milestone: Complete homepage design and deliver Figma files
                </p>
                <div className="mb-5 flex items-center justify-between">
                  {["Funds locked", "Submitted", "Verified", "Dispute window", "Released"].map((step, i, arr) => (
                    <div key={step} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-mint" : "bg-border"}`} />
                        <span className="hidden text-center text-[8px] leading-tight text-muted-2 sm:block">{step}</span>
                      </div>
                      {i < arr.length - 1 && <span className="mx-1 h-px flex-1 bg-border" />}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="flex-1 rounded-[8px] border border-mint/40 py-2.5 text-xs font-semibold text-mint">Mark Complete</button>
                  <button type="button" className="flex-1 rounded-[8px] border border-border py-2.5 text-xs font-semibold text-muted">Open Dispute</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — AUTOPAY */}
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 rounded-[14px] border border-border bg-surface p-6 lg:order-1">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-2">
                      <RefreshCw className="h-4 w-4 text-cream" />
                    </div>
                    <div>
                      <p className="font-semibold text-cream">Team Retainer</p>
                      <p className="text-xs text-muted-2">Monthly · Next: Feb 1</p>
                    </div>
                  </div>
                  <span className="rounded-[6px] border border-mint/30 bg-mint/10 px-2.5 py-1 text-xs font-semibold text-mint">Active</span>
                </div>
                <div className="mb-4 rounded-[10px] bg-surface-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-2">Amount per cycle</p>
                    <p className="tabular-nums text-lg font-bold text-cream">800 USDC</p>
                  </div>
                </div>
                <div className="mb-4 flex items-center justify-between border-t border-border-subtle pt-4">
                  <p className="text-xs text-muted-2">Vault balance</p>
                  <p className="tabular-nums font-semibold text-cream">$2,400.00</p>
                </div>
                <div className="flex items-center justify-between">
                  {["Jan", "Feb", "Mar", "Apr"].map((m, i) => (
                    <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${i <= 1 ? "bg-mint" : "border border-border"}`} />
                      <span className="text-[9px] uppercase tracking-[0.06em] text-muted-2">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-2">02 · AutoPay</p>
                <h3 className="text-3xl font-black leading-tight tracking-tight text-cream lg:text-4xl">
                  Set it once. Never miss a payment.
                </h3>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Schedule recurring payments to any wallet. Fund a vault once and ONYX executes
                  on your set schedule — weekly, biweekly, or monthly.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Schedule-based", "Vault funding", "Pause anytime"].map((tag) => (
                    <span key={tag} className="rounded-[6px] border border-border bg-surface px-2.5 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-border bg-surface px-2.5 py-1.5 text-xs text-muted">
                  <EnvDot tone="soon" />
                  Rialo testnet · Self-executing payments
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — SPLIT */}
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-2">03 · Split</p>
                <h3 className="text-3xl font-black leading-tight tracking-tight text-cream lg:text-4xl">
                  One address. Instant distribution.
                </h3>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Create a shared payment address. Any USDC or USDT sent to it distributes
                  automatically between all parties based on pre-set percentages.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Instant split", "Up to 10 parties", "Private via REX"].map((tag) => (
                    <span key={tag} className="rounded-[6px] border border-border bg-surface px-2.5 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-border bg-surface px-2.5 py-1.5 text-xs text-muted">
                  <EnvDot tone="soon" />
                  Rialo testnet · REX privacy
                </div>
              </div>
              <div className="rounded-[14px] border border-border bg-surface p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-2">Split contract</p>
                <h4 className="mb-4 font-semibold text-cream">Agency Revenue Split</h4>

                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-[10px] border border-border-subtle bg-surface-2 px-4 py-2 text-center">
                    <p className="text-[10px] text-muted-2">Incoming</p>
                    <p className="tabular-nums text-sm font-bold text-cream">$10,000 USDC</p>
                  </div>
                  <span className="h-5 w-px bg-border" />
                  <div className="rounded-[8px] border border-mint/40 bg-mint/10 px-4 py-1.5 text-xs font-bold text-mint">ONYX</div>
                  <div className="flex w-full items-start justify-center gap-8">
                    <span className="h-5 w-px -translate-x-8 -rotate-[24deg] bg-border" />
                    <span className="h-5 w-px translate-x-8 rotate-[24deg] bg-border" />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-3">
                    <div className="rounded-[10px] bg-surface-2 p-3 text-center">
                      <p className="text-xs text-cream">Alice</p>
                      <p className="mt-1 text-sm font-bold text-mint">60%</p>
                      <p className="tabular-nums text-[11px] text-muted-2">$6,000</p>
                    </div>
                    <div className="rounded-[10px] bg-surface-2 p-3 text-center">
                      <p className="text-xs text-cream">Bob</p>
                      <p className="mt-1 text-sm font-bold text-mint">40%</p>
                      <p className="tabular-nums text-[11px] text-muted-2">$4,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — PAYROLL */}
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 rounded-[14px] border border-border bg-surface p-6 lg:order-1">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-2">Payroll</p>
                    <h4 className="mt-1 font-semibold text-cream">Engineering Team</h4>
                  </div>
                  <span className="rounded-[6px] border border-mint/30 bg-mint/10 px-2.5 py-1 text-xs font-semibold text-mint">Active</span>
                </div>
                <div className="mb-5 space-y-2">
                  {[
                    { name: "Sarah Chen", role: "Frontend", amount: "900 USDC" },
                    { name: "Marcus Roy", role: "Backend", amount: "1,200 USDC" },
                    { name: "Priya Nair", role: "Design", amount: "800 USDC" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between rounded-[10px] bg-surface-2 px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-cream">{c.name}</p>
                        <p className="text-xs text-muted-2">{c.role}</p>
                      </div>
                      <p className="tabular-nums text-sm font-semibold text-cream">{c.amount}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-4 flex items-center justify-between text-xs">
                  {["Review", "Approve", "Execute", "Settled"].map((step, i) => (
                    <span key={step} className={`font-medium ${i === 0 ? "text-cream" : "text-muted-2"}`}>{step}</span>
                  ))}
                </div>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-mint py-3 text-sm font-bold text-bg">
                  <CheckCircle2 className="h-4 w-4" />
                  Approve &amp; Pay · 2,900 USDC
                </button>
              </div>
              <div className="order-1 lg:order-2">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-2">04 · Payroll</p>
                <h3 className="text-3xl font-black leading-tight tracking-tight text-cream lg:text-4xl">
                  Pay the whole team. In one approval.
                </h3>
                <p className="mt-5 text-base leading-relaxed text-muted">
                  Add contractors, set the schedule, and approve each cycle. ONYX distributes
                  payments to every wallet in a single settlement.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Multi-wallet", "USDC & USDT", "One approval"].map((tag) => (
                    <span key={tag} className="rounded-[6px] border border-border bg-surface px-2.5 py-1 text-xs text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-border bg-surface px-2.5 py-1.5 text-xs text-muted">
                  <EnvDot tone="soon" />
                  Rialo testnet · Private salaries via REX
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CONTROL LAYER ──────────────────────────────────────────────── */}
      <SectionDivider />
      <section id="control" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>Control layer</Eyebrow>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              Financial automation needs control.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Spending policies */}
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">Spending policies</p>
              <div className="space-y-2">
                {[
                  ["Per transaction", "< $10,000", "Automatic"],
                  ["Per transaction", "$10K – $100K", "1 approval"],
                  ["Per transaction", ">$100,000", "2 approvals"],
                ].map(([label, range, rule]) => (
                  <div key={range} className="rounded-[10px] bg-surface-2 p-3">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted-2">{label}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="tabular-nums text-sm font-semibold text-cream">{range}</p>
                      <p className="text-xs font-medium text-mint">{rule}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">Permissions</p>
              <div className="space-y-2">
                {[
                  ["Admin", "Full control"],
                  ["Operator", "Create + execute"],
                  ["Viewer", "Read only"],
                ].map(([role, desc]) => (
                  <div key={role} className="flex items-center justify-between rounded-[10px] bg-surface-2 p-3">
                    <p className="text-sm font-semibold text-cream">{role}</p>
                    <p className="text-xs text-muted-2">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit trail */}
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">Audit trail</p>
              <div className="space-y-2.5 font-mono text-[11px]">
                {[
                  ["14:32:08", "Payment created"],
                  ["14:32:11", "Policy evaluated"],
                  ["14:32:13", "Approval received"],
                  ["14:32:18", "Funds locked"],
                  ["14:32:24", "Settlement completed"],
                ].map(([time, event]) => (
                  <div key={time} className="flex items-center gap-3">
                    <span className="text-muted-2">{time}</span>
                    <span className="text-cream">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TREASURY ────────────────────────────────────────────────────── */}
      <SectionDivider />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
            <div className="flex flex-col justify-center">
              <Eyebrow>Treasury</Eyebrow>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
                See where every dollar is.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Available balance, funds locked in escrow, pending settlement, and scheduled
                payments — one view of where capital sits at any moment.
              </p>
            </div>
            <div className="rounded-[14px] border border-border bg-surface p-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">Treasury</p>
              <div className="space-y-2.5">
                {[
                  ["Available", "$3,982,120", "bg-mint"],
                  ["In escrow", "$638,271", "bg-info"],
                  ["Pending", "$200,000", "bg-warning"],
                  ["Scheduled", "$412,000", "bg-muted-2"],
                ].map(([label, value, color]) => (
                  <div key={label} className="flex items-center justify-between rounded-[10px] bg-surface-2 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <p className="text-sm text-cream">{label}</p>
                    </div>
                    <p className="tabular-nums text-sm font-semibold text-cream">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVITY / AUDIT ───────────────────────────────────────────── */}
      <SectionDivider />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <Eyebrow>Activity</Eyebrow>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              Every payment has a history.
            </h2>
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {["All", "Escrow", "AutoPay", "Split", "Payroll"].map((f, i) => (
              <span
                key={f}
                className={`rounded-[6px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] ${
                  i === 0 ? "bg-mint text-bg" : "border border-border text-muted"
                }`}
              >
                {f}
              </span>
            ))}
          </div>

          <div className="overflow-x-auto rounded-[14px] border border-border">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-[10px] uppercase tracking-[0.1em] text-muted-2">
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Counterparty</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["14:32", "Escrow", "Website Redesign", "$4,200", "Settled"],
                  ["13:48", "Payroll", "Engineering Team", "$2,900", "Settled"],
                  ["12:14", "Split", "Agency Revenue", "$18,400", "Processing"],
                  ["11:52", "AutoPay", "Infrastructure", "$800", "Scheduled"],
                ].map((row) => (
                  <tr key={row[2]} className="border-b border-border-subtle bg-surface last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-muted-2">{row[0]}</td>
                    <td className="px-4 py-3 text-cream">{row[1]}</td>
                    <td className="px-4 py-3 text-muted">{row[2]}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-cream">{row[3]}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-xs font-medium ${
                          row[4] === "Settled" ? "text-success" : row[4] === "Processing" ? "text-warning" : "text-info"
                        }`}
                      >
                        {row[4]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ───────────────────────────────────────────────── */}
      <SectionDivider />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>Architecture</Eyebrow>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
              Built on infrastructure designed for programmable finance.
            </h2>
          </div>

          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <div className="rounded-[10px] border border-mint/40 bg-mint/10 px-6 py-3 text-center">
              <p className="text-sm font-bold text-mint">ONYX Payment Engine</p>
            </div>
            <span className="h-6 w-px bg-border" />
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {["Escrow", "AutoPay", "Split", "Payroll"].map((n) => (
                <div key={n} className="rounded-[8px] border border-border bg-surface px-3 py-2.5 text-center text-xs font-semibold text-cream">
                  {n}
                </div>
              ))}
            </div>
            <span className="h-6 w-px bg-border" />
            <div className="rounded-[10px] border border-border bg-surface-2 px-6 py-3 text-center">
              <p className="text-sm font-bold text-cream">Rialo Network</p>
            </div>
            <span className="h-6 w-px bg-border" />
            <div className="grid w-full grid-cols-3 gap-3">
              {["Privacy", "Compliance", "Automation"].map((n) => (
                <div key={n} className="rounded-[8px] border border-border bg-surface px-3 py-2.5 text-center text-xs font-semibold text-muted">
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy / Compliance / Automation detail */}
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Compliance",
                body: "Rules and policy checks run before execution.",
                detail: "Rialo IPC screens wallet addresses for sanctions compliance before funds move.",
              },
              {
                icon: Lock,
                title: "Privacy",
                body: "Sensitive payment terms stay protected on-chain.",
                detail: "Contract amounts and terms can be encrypted via Rialo REX, visible only to involved parties.",
              },
              {
                icon: Zap,
                title: "Automation",
                body: "Payments respond to predefined conditions.",
                detail: "Native HTTP calls let contracts react to real-world events — merges, deliveries, API triggers.",
              },
            ].map(({ icon: Icon, title, body, detail }) => (
              <div key={title} className="rounded-[14px] border border-border-subtle bg-surface p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-2">
                  <Icon className="h-4 w-4 text-mint" />
                </div>
                <h3 className="mb-1.5 font-semibold text-cream">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted-2">{detail}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-border px-2.5 py-1 text-[11px] text-muted-2">
                  <EnvDot tone="soon" />
                  Coming on Rialo testnet
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPERS ──────────────────────────────────────────────────── */}
      <SectionDivider />
      <section id="developers" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <Eyebrow>Developers</Eyebrow>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-cream sm:text-4xl lg:text-5xl">
                Built for developers.
                <br />
                Designed for finance teams.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Escrow, AutoPay, Split and Payroll contracts today run through the ONYX console.
                A typed SDK for programmatic access is on the roadmap.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="/docs" className="inline-flex items-center gap-1.5 text-sm font-medium text-mint transition-colors hover:text-white">
                  Read documentation <ChevronRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-cream"
                >
                  <GitBranch className="h-3.5 w-3.5" />
                  View GitHub
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[14px] border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="font-mono text-[11px] text-muted-2">create-escrow.ts</span>
                <span className="rounded-[6px] border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-warning">
                  Conceptual API
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-cream">
{`const payment = await onyx.payments.create({
  type: "escrow",
  amount: "500 USDC",
  recipient: wallet,
  condition: "milestone.complete",
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <SectionDivider />
      <section className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-cream sm:text-4xl lg:text-5xl">
            Put your payment rules on autopilot.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            Create your first programmable payment workflow without managing a wallet manually.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={launchApp}
              className="inline-flex items-center gap-2 rounded-[9px] bg-mint px-7 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-white"
            >
              Launch Console
              <ChevronRight className="h-4 w-4" />
            </button>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 rounded-[9px] border border-border px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:border-muted-2"
            >
              Documentation
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-2">
            No wallet required · Testnet available · Built on Rialo
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <SectionDivider />
      <footer className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <OnyxMark className="h-4 w-4 text-mint" />
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-cream">ONYX</p>
              </div>
              <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-muted-2">
                Programmable payment infrastructure.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">Platform</p>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <a href="#primitives" className="transition-colors hover:text-cream">Escrow</a>
                <a href="#primitives" className="transition-colors hover:text-cream">AutoPay</a>
                <a href="#primitives" className="transition-colors hover:text-cream">Split</a>
                <a href="#primitives" className="transition-colors hover:text-cream">Payroll</a>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">Developers</p>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <a href="/docs" className="transition-colors hover:text-cream">Documentation</a>
                <a href="#developers" className="transition-colors hover:text-cream">API</a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">GitHub</a>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">Network</p>
              <div className="flex flex-col gap-2 text-sm text-muted">
                <span>Rialo — coming soon</span>
                <a href="https://sepolia.etherscan.io" target="_blank" rel="noreferrer" className="transition-colors hover:text-cream">
                  Sepolia testnet
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-8 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-2">© 2026 ONYX · Built on Rialo Network</p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-2 transition-colors hover:text-cream"
            >
              <GitBranch className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
