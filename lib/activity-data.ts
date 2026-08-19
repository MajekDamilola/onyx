import { fetchReceivedTransfers } from "@/lib/alchemy";

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

export type Category = "sent" | "received" | "escrow" | "autopay" | "split" | "payroll";

export interface ActivityItem {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  amount: string;
  token: string;
  sortKey: number;
  hash?: string;
}

export interface ActivitySummary {
  items: ActivityItem[];
  totalSent: number;
  totalReceived: number;
  activeContracts: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function truncate(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

function dateToTs(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function fmt(amount: string) {
  return (parseFloat(amount) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function readLS<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Loads and unifies every source of activity for a wallet:
 * - real on-chain sends ONYX itself submitted (localStorage log)
 * - real on-chain receives read live from Sepolia via Alchemy
 * - Escrow / AutoPay / Split / Payroll contract records (localStorage)
 *
 * Shared by the Activity page and the Dashboard overview so the two never
 * disagree about totals.
 */
export async function loadActivity(walletAddress: string): Promise<ActivitySummary> {
  if (!walletAddress) {
    return { items: [], totalSent: 0, totalReceived: 0, activeContracts: 0 };
  }

  const sends = readLS<OnyxActivity>(`onyx_activity_${walletAddress}`);
  const totalSent = sends.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

  const sendItems: ActivityItem[] = sends.map((t) => ({
    id: `send-${t.hash}`,
    category: "sent",
    title: `Sent ${t.token}`,
    subtitle: `To: ${truncate(t.recipient)}`,
    amount: fmt(t.amount),
    token: t.token,
    sortKey: t.timestamp,
    hash: t.hash,
  }));

  const receives = await fetchReceivedTransfers(walletAddress);
  const totalReceived = receives.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

  const receivedItems: ActivityItem[] = receives.map((t) => ({
    id: `received-${t.hash}`,
    category: "received",
    title: `Received ${t.token}`,
    subtitle: `From: ${truncate(t.from)}`,
    amount: fmt(t.amount),
    token: t.token,
    sortKey: t.timestamp,
    hash: t.hash,
  }));

  const escrows = readLS<EscrowContract>(`escrows_${walletAddress}`);
  const payments = readLS<Payment>(`payments_${walletAddress}`);
  const splits = readLS<SplitContract>(`splits_${walletAddress}`);
  const payrolls = readLS<PayrollContract>(`payrolls_${walletAddress}`);

  const escrowItems: ActivityItem[] = escrows.map((e) => ({
    id: `escrow-${e.id}`,
    category: "escrow",
    title: e.title,
    subtitle: `${e.token} · ${e.status} · ${e.milestone}`,
    amount: fmt(e.amount),
    token: e.token,
    sortKey: dateToTs(e.createdAt),
  }));

  const autopayItems: ActivityItem[] = payments.map((p) => ({
    id: `autopay-${p.id}`,
    category: "autopay",
    title: p.name,
    subtitle: `${p.frequency} · ${truncate(p.recipient)} · ${p.status}`,
    amount: fmt(p.amount),
    token: p.token,
    sortKey: dateToTs(p.nextDue),
  }));

  const splitItems: ActivityItem[] = splits.map((s) => ({
    id: `split-${s.id}`,
    category: "split",
    title: s.name,
    subtitle: `${s.parties.length} ${s.parties.length === 1 ? "party" : "parties"} · ${s.token}`,
    amount: fmt(s.totalReceived),
    token: s.token,
    sortKey: dateToTs(s.createdAt),
  }));

  const payrollItems: ActivityItem[] = payrolls.map((p) => ({
    id: `payroll-${p.id}`,
    category: "payroll",
    title: p.name,
    subtitle: `${p.contractors.length} contractors · ${p.interval} · ${p.status}`,
    amount: fmt(p.totalPayout),
    token: p.token,
    sortKey: dateToTs(p.createdAt),
  }));

  const items = [
    ...sendItems,
    ...receivedItems,
    ...escrowItems,
    ...autopayItems,
    ...splitItems,
    ...payrollItems,
  ].sort((a, b) => b.sortKey - a.sortKey);

  const activeContracts =
    escrows.filter((e) => e.status === "active").length +
    payments.filter((p) => p.status === "active").length +
    splits.length +
    payrolls.filter((p) => p.status === "active").length;

  return { items, totalSent, totalReceived, activeContracts };
}
