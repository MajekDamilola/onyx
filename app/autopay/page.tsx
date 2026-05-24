"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RefreshCw, Plus, X, Bell, Zap } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Send & Receive", href: "/send" },
  { label: "divider-1", href: "#", divider: true },
  { label: "Escrow", href: "/escrow" },
  { label: "AutoPay", href: "/autopay", active: true },
  { label: "Split", href: "/split" },
  { label: "Payroll", href: "/payroll" },
  { label: "divider-2", href: "#", divider: true },
  { label: "Activity", href: "/activity" },
  { label: "Settings", href: "/settings" },
];

interface Bill {
  id: string;
  name: string;
  amount: string;
  token: string;
  frequency: "monthly" | "weekly" | "yearly";
  recipient: string;
  nextDue: string;
  status: "active" | "paused";
}

export default function AutoPayPage() {
  const { authenticated, ready, user, logout } = usePrivy();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);
  const [vaultBalance, setVaultBalance] = useState("0.00");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    token: "USDC",
    frequency: "monthly",
    recipient: "",
    nextDue: "",
  });

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

  const handleCreate = async () => {
    if (!form.name || !form.amount || !form.recipient || !form.nextDue) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newBill: Bill = {
      id: Math.random().toString(36).slice(2, 9),
      name: form.name,
      amount: form.amount,
      token: form.token,
      frequency: form.frequency as Bill["frequency"],
      recipient: form.recipient,
      nextDue: form.nextDue,
      status: "active",
    };
    setBills((prev) => [newBill, ...prev]);
    setForm({ name: "", amount: "", token: "USDC", frequency: "monthly", recipient: "", nextDue: "" });
    setCreating(false);
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-bg text-cream">
      {/* Topbar */}
      <div className="flex items-center justify-between border-b border-[#2a2a26] px-4 py-4 sm:px-6">
        <span className="text-xl font-bold tracking-tight">ONYX</span>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:block font-mono">
            {user?.wallet?.address
              ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
              : user?.email?.address}
          </span>
          <button type="button" onClick={logout} className="text-sm text-muted transition-colors hover:text-cream">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-65px)] flex-col md:flex-row">
        {/* Sidebar */}
        <div className="flex gap-1 overflow-x-auto border-b border-[#2a2a26] p-4 md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
          {navItems.map((item) =>
            item.divider ? (
              <div key={item.label} className="hidden select-none py-1 text-xs text-[#2a2a26] md:block">
                ────────────
              </div>
            ) : (
              
                <a key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  item.active ? "bg-surface-2 font-medium text-cream" : "text-muted hover:bg-surface hover:text-cream"
                }`}
              >
                {item.label}
              </a>
            )
          )}
        </div>

        {/* Main */}
        <div className="flex-1 overflow-auto p-5 sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cream">AutoPay</h1>
              <p className="mt-2 text-muted max-w-xl">
                Never miss a bill again. Fund your vault once and ONYX pays your recurring bills automatically before they expire.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-bg transition hover:bg-cream shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Bill
            </button>
          </div>

          {/* Vault balance card */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#2a2a26] bg-surface p-6">
              <p className="text-sm text-muted">Vault Balance</p>
              <p className="mt-2 text-3xl font-bold text-cream">${vaultBalance}</p>
              <p className="mt-1 text-xs text-muted">Available for automatic payments</p>
              <button className="mt-4 rounded-full border border-mint px-4 py-2 text-xs font-semibold text-mint transition hover:bg-mint hover:text-bg">
                Fund Vault
              </button>
            </div>
            <div className="rounded-2xl border border-mint/20 bg-mint/5 p-6">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 shrink-0 text-mint mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-mint">Coming on Rialo mainnet</p>
                  <p className="mt-1 text-xs text-muted">
                    Self-executing payments — your vault pays bills automatically on-chain without any manual trigger. Keep your vault funded and walk away.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bills list */}
          {bills.length === 0 ? (
            <div className="rounded-2xl border border-[#2a2a26] bg-surface p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint/10">
                <RefreshCw className="h-7 w-7 text-mint" />
              </div>
              <p className="mb-2 font-medium text-cream">No bills set up yet</p>
              <p className="mb-6 text-sm text-muted">Add your first recurring bill to automate payments</p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-bg transition hover:bg-cream"
              >
                <Plus className="h-4 w-4" />
                Add Bill
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {bills.map((bill) => (
                <div key={bill.id} className="rounded-2xl border border-[#2a2a26] bg-surface p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint/10">
                        <RefreshCw className="h-5 w-5 text-mint" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-cream">{bill.name}</h3>
                        <p className="text-sm text-muted capitalize">{bill.frequency}</p>
                      </div>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      bill.status === "active"
                        ? "border-mint/30 bg-mint/10 text-mint"
                        : "border-[#2a2a26] text-muted"
                    }`}>
                      {bill.status === "active" ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div>
                      <p className="text-muted">Amount</p>
                      <p className="font-semibold text-cream">{bill.amount} {bill.token}</p>
                    </div>
                    <div>
                      <p className="text-muted">Next due</p>
                      <p className="font-semibold text-cream">{bill.nextDue}</p>
                    </div>
                    <div>
                      <p className="text-muted">Recipient</p>
                      <p className="font-semibold text-cream font-mono">{bill.recipient.slice(0, 6)}...{bill.recipient.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="button" className="rounded-full border border-[#2a2a26] px-4 py-1.5 text-xs font-semibold text-muted transition hover:text-cream">
                      {bill.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button type="button" className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-400/10">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#2a2a26] bg-surface p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cream">Add Recurring Bill</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="text-muted hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-cream">Bill name</label>
                <input
                  type="text"
                  placeholder="e.g. DSTV subscription, Electricity, Water"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-cream">Recipient wallet address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={form.recipient}
                  onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                  className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-cream">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-cream">Token</label>
                  <select
                    value={form.token}
                    onChange={(e) => setForm({ ...form, token: e.target.value })}
                    className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  >
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-cream">Frequency</label>
                  <select
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-cream">Next due date</label>
                  <input
                    type="date"
                    value={form.nextDue}
                    onChange={(e) => setForm({ ...form, nextDue: e.target.value })}
                    className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-2xl border border-mint/20 bg-mint/5 p-3 text-xs text-mint">
                <Bell className="h-4 w-4 shrink-0 mt-0.5" />
                <p>You will receive a notification 3 days before each payment is due. Make sure your vault is funded.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 rounded-full border border-[#2a2a26] py-3 text-sm font-semibold text-muted transition hover:text-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={creating || !form.name || !form.amount || !form.recipient || !form.nextDue}
                className="flex-1 rounded-full bg-mint py-3 text-sm font-bold text-bg transition hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Adding..." : "Add Bill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}