"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  GitBranch,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

// ─── localStorage shapes ───────────────────────────────────────────────────

interface OnyxActivity {
  hash: string;
  token: string;
  amount: string;
  recipient: string;
  timestamp: number;
}

interface EscrowContract {
  id: string;
  title: string;
  freelancerWallet: string;
  amount: string;
  token: string;
  status: string;
  milestone: string;
  createdAt: string;
}

interface Payment {
  id: string;
  name: string;
  amount: string;
  token: string;
  frequency: string;
  recipient: string;
  nextDue: string;
  status: string;
}

interface SplitContract {
  id: string;
  name: string;
  parties: { name: string; wallet: string; percentage: string }[];
  token: string;
  totalReceived: string;
  createdAt: string;
}

interface PayrollContract {
  id: string;
  name: string;
  contractors: { name: string; wallet: string; amount: string }[];
  interval: string;
  nextPayDate: string;
  status: string;
  totalPayout: string;
  token: string;
  createdAt: string;
}

// ─── Unified item ──────────────────────────────────────────────────────────

type Category = "sent" | "received" | "escrow" | "autopay" | "split" | "payroll";

interface ActivityItem {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  amount: string;
  token: string;
  sortKey: number;
  hash?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function truncate(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dateToTs(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  return isNaN(t) ? 0 : t;
}

function fmtNum(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function readLS<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

// ─── Category config ───────────────────────────────────────────────────────

const CAT_CONFIG: Record<
  Category,
  { icon: React.ElementType; iconColor: string; ringColor: string; bgColor: string }
> = {
  sent:     { icon: ArrowUpRight, iconColor: "text-blue-400",   ringColor: "border-blue-500/30",   bgColor: "bg-blue-500/10"   },
  received: { icon: ArrowUpRight, iconColor: "text-[#BCEDE2]",  ringColor: "border-[#BCEDE2]/30",  bgColor: "bg-[#BCEDE2]/10"  },
  escrow:   { icon: Shield,       iconColor: "text-[#BCEDE2]",  ringColor: "border-[#BCEDE2]/30",  bgColor: "bg-[#BCEDE2]/10"  },
  autopay:  { icon: RefreshCw,    iconColor: "text-green-400",  ringColor: "border-green-500/30",  bgColor: "bg-green-500/10"  },
  split:    { icon: GitBranch,    iconColor: "text-purple-400", ringColor: "border-purple-500/30", bgColor: "bg-purple-500/10" },
  payroll:  { icon: Users,        iconColor: "text-amber-400",  ringColor: "border-amber-500/30",  bgColor: "bg-amber-500/10"  },
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All",     value: "all"      },
  { label: "Sent",    value: "sent"     },
  { label: "Received",value: "received" },
  { label: "Escrow",  value: "escrow"   },
  { label: "AutoPay", value: "autopay"  },
  { label: "Split",   value: "split"    },
  { label: "Payroll", value: "payroll"  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ActivityPage() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || "";
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [totalSent, setTotalSent] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!walletAddress) return;

    // On-chain sends tracked by ONYX
    const sends = readLS<OnyxActivity>(`onyx_activity_${walletAddress}`);
    const sentTotal = sends.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    setTotalSent(sentTotal);

    const sendItems: ActivityItem[] = sends.map((t) => ({
      id: `send-${t.hash}`,
      category: "sent",
      title: `Sent ${t.token}`,
      subtitle: `To: ${truncate(t.recipient)}`,
      amount: parseFloat(t.amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }),
      token: t.token,
      sortKey: t.timestamp,
      hash: t.hash,
    }));

    // Contract activity from localStorage
    const escrows = readLS<EscrowContract>(`escrows_${walletAddress}`);
    const payments = readLS<Payment>(`payments_${walletAddress}`);
    const splits = readLS<SplitContract>(`splits_${walletAddress}`);
    const payrolls = readLS<PayrollContract>(`payrolls_${walletAddress}`);

    const escrowItems: ActivityItem[] = escrows.map((e) => ({
      id: `escrow-${e.id}`,
      category: "escrow",
      title: e.title,
      subtitle: `${e.token} · ${e.status} · ${e.milestone}`,
      amount: parseFloat(e.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      token: e.token,
      sortKey: dateToTs(e.createdAt),
    }));

    const autopayItems: ActivityItem[] = payments.map((p) => ({
      id: `autopay-${p.id}`,
      category: "autopay",
      title: p.name,
      subtitle: `${p.frequency} · ${truncate(p.recipient)} · ${p.status}`,
      amount: parseFloat(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      token: p.token,
      sortKey: dateToTs(p.nextDue),
    }));

    const splitItems: ActivityItem[] = splits.map((s) => ({
      id: `split-${s.id}`,
      category: "split",
      title: s.name,
      subtitle: `${s.parties.length} ${s.parties.length === 1 ? "party" : "parties"} · ${s.token}`,
      amount: parseFloat(s.totalReceived).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      token: s.token,
      sortKey: dateToTs(s.createdAt),
    }));

    const payrollItems: ActivityItem[] = payrolls.map((p) => ({
      id: `payroll-${p.id}`,
      category: "payroll",
      title: p.name,
      subtitle: `${p.contractors.length} contractors · ${p.interval} · ${p.status}`,
      amount: parseFloat(p.totalPayout).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      token: p.token,
      sortKey: dateToTs(p.createdAt),
    }));

    const all = [
      ...sendItems,
      ...escrowItems,
      ...autopayItems,
      ...splitItems,
      ...payrollItems,
    ].sort((a, b) => b.sortKey - a.sortKey);

    setItems(all);
  }, [walletAddress]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0A]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const filtered =
    activeFilter === "all"
      ? items
      : activeFilter === "received"
      ? []
      : items.filter((item) => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#090A0A] text-cream">
      <Topbar />
      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="activity" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#252929] pb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">History</p>
              <h1 className="text-4xl font-black tracking-tight text-cream">Activity</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                On-chain transfers and contract activity across your connected wallet.
              </p>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Total sent</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">${fmtNum(totalSent)}</p>
              </div>
              <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Total received</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">$0.00</p>
              </div>
              <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Total transactions</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">{items.length}</p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setActiveFilter(f.value)}
                  className={`rounded-[6px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    activeFilter === f.value
                      ? "bg-[#BCEDE2] text-[#090A0A]"
                      : "border border-[#252929] text-muted hover:border-[#313737] hover:text-cream"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Feed */}
            {filtered.length === 0 ? (
              <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-12 text-center">
                <p className="text-sm font-semibold text-cream">No activity yet</p>
                <p className="mt-1 text-xs text-muted">
                  Transactions and contracts will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((item) => {
                  const cfg = CAT_CONFIG[item.category];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-[12px] border border-[#252929] bg-[#0E1010] p-4 transition-colors hover:border-[#313737]"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${cfg.ringColor} ${cfg.bgColor}`}
                      >
                        <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-cream">{item.title}</p>
                        <p className="mt-0.5 text-[10px] text-muted">{item.subtitle}</p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-cream">
                          {item.category === "sent" ? "-" : ""}{item.amount} {item.token}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted">{formatDate(item.sortKey)}</p>
                        {item.hash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${item.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-muted transition-colors hover:text-[#BCEDE2]"
                          >
                            Etherscan
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
