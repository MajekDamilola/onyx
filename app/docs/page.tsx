"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ChevronRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import OnyxMark from "@/components/OnyxMark";

const GITHUB_URL = "https://github.com/MajekDamilola/onyx";

type NavItem = { id: string; label: string };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "Get started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "getting-started", label: "Getting started" },
      { id: "core-model", label: "Core model" },
    ],
  },
  {
    title: "Payment primitives",
    items: [
      { id: "escrow", label: "Escrow" },
      { id: "autopay", label: "AutoPay" },
      { id: "split", label: "Split" },
      { id: "payroll", label: "Payroll" },
    ],
  },
  {
    title: "Wallet",
    items: [
      { id: "send-receive", label: "Send & Receive" },
      { id: "swap-bridge", label: "Swap & Bridge" },
    ],
  },
  {
    title: "Console",
    items: [
      { id: "activity", label: "Activity & audit" },
      { id: "settings", label: "Settings" },
    ],
  },
  {
    title: "Platform",
    items: [
      { id: "networks", label: "Networks & environments" },
      { id: "security", label: "Security & compliance" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "api-reference", label: "API reference" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-2">{children}</p>;
}

function Doc({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border-subtle py-12 first:pt-0">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-2xl font-black tracking-tight text-cream sm:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-base font-bold text-cream">{children}</h3>;
}

function Callout({ tone, children }: { tone: "info" | "warning"; children: ReactNode }) {
  const styles =
    tone === "info"
      ? "border-mint/25 bg-mint/5 text-mint"
      : "border-warning/25 bg-warning/5 text-warning";
  return (
    <div className={`rounded-[10px] border px-4 py-3 text-[13px] leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-muted-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function StatusTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-border">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k} className={i !== rows.length - 1 ? "border-b border-border-subtle" : ""}>
              <td className="whitespace-nowrap bg-surface px-4 py-2.5 font-mono text-xs text-cream">{k}</td>
              <td className="px-4 py-2.5 text-muted">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  const { login, authenticated } = usePrivy();

  const launchApp = () => {
    if (authenticated) window.location.href = "/dashboard";
    else login();
  };

  return (
    <main className="min-h-screen bg-bg text-cream">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border-subtle bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <OnyxMark className="h-4 w-4 text-mint" />
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-cream">ONYX</span>
            </a>
            <span className="hidden text-xs text-muted-2 sm:block">Documentation</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/" className="hidden text-[13px] text-muted transition-colors hover:text-cream sm:block">
              ← Back to home
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

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">

          {/* Mobile TOC */}
          <div className="-mx-5 flex gap-1.5 overflow-x-auto border-b border-border-subtle px-5 pb-4 lg:hidden">
            {NAV.flatMap((g) => g.items).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-[6px] border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-cream"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col gap-6 overflow-y-auto pb-10">
              {NAV.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-2">{group.title}</p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="rounded-[6px] px-2 py-1.5 text-[13px] text-muted transition-colors hover:bg-surface hover:text-cream"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 max-w-3xl">

            <Doc id="introduction" eyebrow="Overview" title="Introduction">
              <p>
                ONYX is programmable payment infrastructure. Instead of moving money one transaction
                at a time, you define a rule — who gets paid, when, how much, and under what
                condition — and ONYX executes it.
              </p>
              <p>
                Four primitives cover the common shapes of business payments: <strong className="text-cream">Escrow</strong> for
                milestone-based work, <strong className="text-cream">AutoPay</strong> for recurring payments,{" "}
                <strong className="text-cream">Split</strong> for revenue distribution, and{" "}
                <strong className="text-cream">Payroll</strong> for paying a team on a schedule.
              </p>
              <Callout tone="info">
                ONYX is under active development on Ethereum Sepolia testnet, building toward
                deeper integration with Rialo Network. Sections below are labeled with their
                current status.
              </Callout>
            </Doc>

            <Doc id="getting-started" eyebrow="Get started" title="Getting started">
              <SubHeading>1. Sign in</SubHeading>
              <p>
                ONYX uses email login through Privy — there is no browser extension or seed phrase
                to manage up front. Signing in for the first time automatically provisions an
                embedded wallet tied to your account.
              </p>
              <SubHeading>2. Fund your wallet</SubHeading>
              <p>
                ONYX currently runs on Ethereum Sepolia testnet. You&apos;ll need Sepolia ETH for gas
                and testnet USDC or USDT to move through the console. Testnet funds have no real
                value and are available from public Sepolia faucets.
              </p>
              <SubHeading>3. Create your first contract</SubHeading>
              <p>
                From the console <span className="text-cream">Overview</span>, choose a payment
                primitive — Escrow, AutoPay, Split, or Payroll — and follow the create flow. Every
                contract you create is scoped to your connected wallet.
              </p>
            </Doc>

            <Doc id="core-model" eyebrow="Concepts" title="Core model">
              <p>
                Every ONYX primitive follows the same shape:
              </p>
              <List
                items={[
                  <><strong className="text-cream">Who</strong> — the counterparty (freelancer, contractor, recipient, or set of parties).</>,
                  <><strong className="text-cream">When</strong> — a schedule, milestone, or triggering condition.</>,
                  <><strong className="text-cream">How much</strong> — the amount and token (USDC or USDT).</>,
                  <><strong className="text-cream">Under what condition</strong> — what has to be true for funds to move.</>,
                ]}
              />
              <p>
                You define these once. ONYX tracks contract state and exposes the actions available
                to each party at each stage — for example, a client can release funds early or open
                a dispute, while a freelancer can mark a milestone complete.
              </p>
            </Doc>

            <Doc id="escrow" eyebrow="01 · Primitive" title="Escrow">
              <p>
                Lock funds against a milestone. The client creates the contract, the freelancer
                delivers, and funds release automatically after a 48-hour dispute window — or
                immediately if the client releases early.
              </p>
              <SubHeading>Delivery methods</SubHeading>
              <List
                items={[
                  <><strong className="text-cream">Manual</strong> — the freelancer marks the milestone complete themselves. Live today.</>,
                  <><strong className="text-cream">GitHub PR merge</strong> — releases when a linked pull request merges.</>,
                  <><strong className="text-cream">Google Drive</strong> — releases when a file is delivered to a linked folder.</>,
                ]}
              />
              <Callout tone="warning">
                Automatic GitHub and Drive delivery detection is coming with the Rialo network
                integration. Today, both delivery methods display contract terms; only manual
                delivery drives status changes.
              </Callout>
              <SubHeading>Status lifecycle</SubHeading>
              <StatusTable
                rows={[
                  ["active", "Funds committed, milestone in progress."],
                  ["completed", "Freelancer marked delivery — 48-hour dispute window running."],
                  ["disputed", "Client opened a dispute before the window closed."],
                  ["released", "Funds released to the freelancer, early or after the window."],
                ]}
              />
              <SubHeading>Roles</SubHeading>
              <p>
                ONYX determines your role by comparing your connected wallet to the contract&apos;s
                stored client and freelancer addresses. Anyone else viewing the link sees a
                read-only observer view.
              </p>
              <Callout tone="info">
                Escrow contract records are scoped to the browser that created them. Sharing a link
                lets the other party view and act on the contract from their own device once they
                open it in a browser that has synced state — full cross-device sync ships with the
                Rialo network integration.
              </Callout>
            </Doc>

            <Doc id="autopay" eyebrow="02 · Primitive" title="AutoPay">
              <p>
                Schedule a recurring payment to any wallet address — weekly, monthly, or yearly.
                Create a payment, and it appears in your AutoPay list with its next due date.
              </p>
              <SubHeading>What you can do today</SubHeading>
              <List
                items={[
                  "Add a recurring payment with an amount, token, frequency, and recipient.",
                  "Pause or resume a scheduled payment.",
                  "Remove a payment.",
                ]}
              />
              <Callout tone="warning">
                Vault funding and self-executing, on-chain payment triggers are part of the Rialo
                network integration and are not yet live — AutoPay currently manages the schedule
                and terms, not automatic fund movement.
              </Callout>
            </Doc>

            <Doc id="split" eyebrow="03 · Primitive" title="Split">
              <p>
                Define a set of parties and a percentage split (must total 100%). ONYX generates a
                shared payment address for the split.
              </p>
              <List
                items={[
                  "Up to 10 parties per split, each with a name, wallet address, and percentage.",
                  "Token is USDC or USDT.",
                  "Copy the payment address to share with a client or payer.",
                ]}
              />
              <Callout tone="warning">
                Automatic detection and distribution of incoming funds is part of the Rialo network
                integration. Today, Split defines the address and the split terms for planning
                purposes.
              </Callout>
            </Doc>

            <Doc id="payroll" eyebrow="04 · Primitive" title="Payroll">
              <p>
                Add contractors with a name, role, wallet address, and amount, set a pay schedule,
                and review the full cycle in one place.
              </p>
              <List
                items={[
                  "Weekly, biweekly, or monthly pay schedules.",
                  "Any number of contractors per payroll, each paid independently.",
                  "A running total per cycle across all contractors.",
                ]}
              />
              <Callout tone="warning">
                Executing a payroll run — approving and settling payment to every wallet — is part
                of the Rialo network integration. Today, Payroll builds and previews the cycle.
              </Callout>
            </Doc>

            <Doc id="send-receive" eyebrow="Wallet" title="Send & Receive">
              <p>
                Send moves tokens directly from your connected wallet on Ethereum Sepolia — this is
                a real on-chain transaction, submitted through your Privy embedded wallet or
                connected external wallet.
              </p>
              <List
                items={[
                  "Live ERC-20 balances are read directly from Sepolia.",
                  "Every send is confirmed on-chain and linked to its Etherscan transaction.",
                  "Sent transactions appear immediately in your Activity feed.",
                ]}
              />
            </Doc>

            <Doc id="swap-bridge" eyebrow="Wallet" title="Swap & Bridge">
              <p>
                Swap and Bridge are visible in the console today as a preview of what&apos;s coming —
                exchanging between tokens and moving assets across chains. Both actions are
                disabled pending the Rialo network integration.
              </p>
            </Doc>

            <Doc id="activity" eyebrow="Console" title="Activity & audit">
              <p>
                Activity unifies two sources into one feed: real on-chain sends from Sepolia, and
                contract records from Escrow, AutoPay, Split, and Payroll. Filter by category to
                narrow the view.
              </p>
              <p>
                Every sent transaction links out to its Sepolia Etherscan record, so you always
                have an independent, verifiable audit trail for on-chain activity.
              </p>
            </Doc>

            <Doc id="settings" eyebrow="Console" title="Settings">
              <p>
                Export your embedded wallet, sign out, and view your connected account details. If
                you signed in with email, your wallet is created and secured through Privy —
                exporting it gives you the underlying key.
              </p>
            </Doc>

            <Doc id="networks" eyebrow="Platform" title="Networks & environments">
              <StatusTable
                rows={[
                  ["Ethereum Sepolia", "Live — the network ONYX currently transacts on. Testnet funds only."],
                  ["Rialo Network", "Coming soon — on-chain enforcement, privacy (REX), and compliance (IPC) for all four primitives."],
                ]}
              />
              <p>
                Every primitive page in the console labels which of its capabilities are live today
                versus arriving with Rialo — look for the status badge on each feature card.
              </p>
            </Doc>

            <Doc id="security" eyebrow="Platform" title="Security & compliance">
              <p>
                ONYX relies on Privy for authentication and embedded wallet custody. Your wallet key
                is not stored by ONYX directly.
              </p>
              <p>
                Compliance screening (Rialo IPC) and payment privacy (Rialo REX) are part of the
                Rialo network integration and are not active on Sepolia testnet today. Do not use
                ONYX on Sepolia for anything beyond testing with testnet funds.
              </p>
            </Doc>

            <Doc id="api-reference" eyebrow="Reference" title="API reference">
              <p>
                A typed SDK for creating and managing contracts programmatically is planned but not
                yet available. The shape below reflects the intended interface once it ships.
              </p>
              <div className="overflow-hidden rounded-[12px] border border-border bg-surface">
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
              <p>
                In the meantime, the console is the interface — every action documented above is
                available through the UI.
              </p>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-mint transition-colors hover:text-white"
              >
                View source on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Doc>

            <Doc id="faq" eyebrow="Reference" title="FAQ">
              <SubHeading>Do I need a wallet to sign up?</SubHeading>
              <p>No. Sign in with email — ONYX provisions an embedded wallet for you automatically via Privy.</p>
              <SubHeading>Is this real money?</SubHeading>
              <p>
                Not today. ONYX runs on Ethereum Sepolia testnet — all balances and transfers use
                testnet tokens with no real-world value.
              </p>
              <SubHeading>Why do some features say &quot;Coming on Rialo testnet&quot;?</SubHeading>
              <p>
                On-chain contract enforcement, automated condition detection, compliance screening,
                and payment privacy are being built against Rialo Network. Until that integration
                ships, those specific capabilities are previewed in the UI but not yet functional —
                every such feature is labeled clearly where it appears.
              </p>
              <SubHeading>Where can I see the source?</SubHeading>
              <p>
                ONYX is open on GitHub at{" "}
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-mint hover:text-white">
                  github.com/MajekDamilola/onyx
                </a>.
              </p>
            </Doc>

          </div>
        </div>
      </div>
    </main>
  );
}
