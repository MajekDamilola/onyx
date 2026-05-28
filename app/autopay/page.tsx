"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Plus, RefreshCw, Wallet, X, Zap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface Payment {
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
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [vaultBalance] = useState("0.00");
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
    const newPayment: Payment = {
      id: Math.random().toString(36).slice(2, 9),
      name: form.name,
      amount: form.amount,
      token: form.token,
      frequency: form.frequency as Payment["frequency"],
      recipient: form.recipient,
      nextDue: form.nextDue,
      status: "active",
    };
    setPayments((prev) => [newPayment, ...prev]);
    setForm({ name: "", amount: "", token: "USDC", frequency: "monthly", recipient: "", nextDue: "" });
    setCreating(false);
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-bg text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="autopay" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-12 top-10 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-4 h-1 w-14 rounded-full bg-mint shadow-[0_0_24px_rgba(187,235,225,0.45)]" />
                <h1 className="text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                  AutoPay
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
                  Schedule recurring payments to any Rialo wallet address. Set the amount, frequency, and recipient - ONYX handles the rest. Fund your vault and never miss a payment again.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-colors hover:bg-cream"
              >
                <Plus className="h-4 w-4" />
                Add Payment
              </button>
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                  <Wallet className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted">Vault Balance</p>
                <p className="mt-2 text-4xl font-bold text-cream">${vaultBalance}</p>
                <p className="mt-2 text-sm text-muted">Available for scheduled payments to Rialo wallets</p>
                <button className="mt-5 rounded-full border border-mint px-5 py-2.5 text-sm font-semibold text-mint transition-colors hover:bg-mint hover:text-bg">
                  Fund Vault
                </button>
              </div>

              <div className="rounded-3xl border border-mint/20 bg-mint/5 p-6 transition-colors hover:border-mint/40">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-mint">Coming on Rialo mainnet</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Self-executing payments - on Rialo mainnet, your vault triggers payments automatically on-chain without any manual approval. Connect external APIs to trigger payments based on real-world events.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="rounded-3xl border border-[#2a2a26] bg-surface p-12 text-center transition-colors hover:border-[#3a3a36]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mint/10">
                  <RefreshCw className="h-10 w-10 text-mint" />
                </div>
                <p className="mb-3 text-2xl font-bold text-cream">No scheduled payments yet</p>
                <p className="mx-auto mb-7 max-w-lg text-sm leading-6 text-muted">
                  Add a recurring payment, fund your vault, and let ONYX handle the schedule.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-colors hover:bg-cream"
                >
                  <Plus className="h-4 w-4" />
                  Add Payment
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint/10">
                          <RefreshCw className="h-5 w-5 text-mint" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-cream">{payment.name}</h3>
                          <p className="text-sm capitalize text-muted">{payment.frequency}</p>
                        </div>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        payment.status === "active"
                          ? "border-mint/30 bg-mint/10 text-mint"
                          : "border-[#2a2a26] text-muted"
                      }`}>
                        {payment.status === "active" ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                      <div><p className="text-muted">Amount</p><p className="font-semibold text-cream">{payment.amount} {payment.token}</p></div>
                      <div><p className="text-muted">Next payment</p><p className="font-semibold text-cream">{payment.nextDue}</p></div>
                      <div><p className="text-muted">Recipient</p><p className="font-mono font-semibold text-cream">{payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}</p></div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <button type="button" className="rounded-full border border-[#2a2a26] px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-mint hover:text-cream">
                        {payment.status === "active" ? "Pause" : "Resume"}
                      </button>
                      <button type="button" className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-400/10">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 text-sm text-muted">
              Recipients must have a Rialo network wallet address to receive payments.
            </p>
          </div>
        </main>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-[#2a2a26] bg-surface p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cream">Add Recurring Payment</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-full border border-[#2a2a26] p-2 text-muted transition-colors hover:border-mint hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-cream">Payment name</span>
                <input type="text" placeholder="e.g. Team retainer, Monthly subscription, Rent payment" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-cream">Recipient wallet address</span>
                <input type="text" placeholder="0x..." value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 font-mono text-sm text-cream outline-none transition-colors focus:border-mint" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-cream">Amount</span>
                  <input type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint" />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-cream">Token</span>
                  <select value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint">
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="mb-2 block text-sm font-semibold text-cream">Frequency</span>
                  <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-cream">Next payment date</span>
                  <input type="date" value={form.nextDue} onChange={(e) => setForm({ ...form, nextDue: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint" />
                </label>
              </div>

              <div className="flex items-start gap-2 rounded-2xl border border-mint/20 bg-mint/5 p-3 text-xs leading-5 text-mint">
                <Bell className="mt-0.5 h-4 w-4 shrink-0" />
                <p>You will receive a notification 3 days before each payment is due. Keep your vault funded.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-[#2a2a26] py-3 text-sm font-semibold text-muted transition-colors hover:border-mint hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !form.name || !form.amount || !form.recipient || !form.nextDue} className="flex-1 rounded-full bg-mint py-3 text-sm font-bold text-bg transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Adding..." : "Add Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
