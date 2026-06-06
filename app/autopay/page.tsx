"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, ChevronDown, Plus, RefreshCw, Wallet, X, Zap } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
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

  const inputCls = "w-full rounded-[4px] border border-[#2a2a26] bg-[#141414] px-4 py-3 text-sm text-cream placeholder:text-muted outline-none transition-colors focus:border-[#BBEBE1]/40";

  return (
    <div className="min-h-screen bg-[#141414] text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="autopay" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#2a2a26] pb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Contracts</p>
                <h1 className="text-4xl font-black tracking-tight text-cream">AutoPay</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                  Schedule recurring payments to any Rialo wallet address. Set the amount, frequency, and recipient — ONYX handles the rest. Fund your vault and never miss a payment again.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-[4px] bg-[#BBEBE1] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-colors hover:bg-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Payment
              </button>
            </div>

            {/* Vault + coming soon */}
            <div className="mb-6 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5">
                <Wallet className="mb-4 h-4 w-4 text-[#BBEBE1]" />
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6b6760]">Vault Balance</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-cream">${vaultBalance}</p>
                <p className="mt-2 text-xs text-muted">Available for scheduled payments to Rialo wallets</p>
                <button className="mt-5 rounded-[4px] border border-[#BBEBE1]/40 px-5 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#BBEBE1] transition-colors hover:bg-[#BBEBE1]/10">
                  Fund Vault
                </button>
              </div>

              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5">
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#BBEBE1]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Coming on Rialo testnet</p>
                    <p className="mt-3 text-xs leading-5 text-muted">
                      Self-executing payments — on Rialo testnet, your vault triggers payments automatically on-chain without any manual approval. Connect external APIs to trigger payments based on real-world events.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            {payments.length === 0 ? (
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-16 text-center">
                <RefreshCw className="mx-auto mb-4 h-8 w-8 text-[#6b6760]" />
                <p className="mb-2 text-base font-bold text-cream">No scheduled payments yet</p>
                <p className="mx-auto mb-6 max-w-lg text-xs leading-5 text-muted">
                  Add a recurring payment, fund your vault, and let ONYX handle the schedule.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#BBEBE1] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-colors hover:bg-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Payment
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5 transition-colors hover:border-[#3a3a36]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-4 w-4 text-[#BBEBE1]" />
                        <div>
                          <h3 className="font-bold text-cream">{payment.name}</h3>
                          <p className="text-xs capitalize text-muted">{payment.frequency}</p>
                        </div>
                      </div>
                      <span className={`rounded-[3px] border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                        payment.status === "active"
                          ? "border-[#BBEBE1]/30 bg-[#BBEBE1]/10 text-[#BBEBE1]"
                          : "border-[#2a2a26] text-muted"
                      }`}>
                        {payment.status === "active" ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-4 text-xs sm:grid-cols-3">
                      <div><p className="text-muted">Amount</p><p className="mt-1 font-semibold text-cream">{payment.amount} {payment.token}</p></div>
                      <div><p className="text-muted">Next payment</p><p className="mt-1 font-semibold text-cream">{payment.nextDue}</p></div>
                      <div><p className="text-muted">Recipient</p><p className="mt-1 font-mono font-semibold text-cream">{payment.recipient.slice(0, 6)}...{payment.recipient.slice(-4)}</p></div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button type="button" className="rounded-[4px] border border-[#2a2a26] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:border-[#3a3a36] hover:text-cream">
                        {payment.status === "active" ? "Pause" : "Resume"}
                      </button>
                      <button type="button" className="rounded-[4px] border border-red-400/30 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-red-400 transition-colors hover:bg-red-400/10">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 text-xs text-muted">
              Recipients must have a Rialo network wallet address to receive payments.
            </p>
          </div>
        </main>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-[#2a2a26] pb-4">
              <h2 className="text-lg font-black tracking-tight text-cream">Add Recurring Payment</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-[3px] border border-[#2a2a26] p-1.5 text-muted transition-colors hover:text-cream">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Payment name</span>
                <input type="text" placeholder="e.g. Team retainer, Monthly subscription" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Recipient wallet address</span>
                <input type="text" placeholder="0x..." value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} className={`${inputCls} font-mono`} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Amount</span>
                  <input type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} />
                </label>
                <label>
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Token</span>
                  <div className="relative">
                    <select value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} className={`${inputCls} appearance-none pr-10`}>
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Frequency</span>
                  <div className="relative">
                    <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className={`${inputCls} appearance-none pr-10`}>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </label>
                <label>
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Next payment date</span>
                  <input type="date" value={form.nextDue} onChange={(e) => setForm({ ...form, nextDue: e.target.value })} className={inputCls} />
                </label>
              </div>

              <div className="flex items-start gap-2 rounded-[4px] border border-[#BBEBE1]/20 bg-[#BBEBE1]/5 p-3 text-[10px] leading-5 text-[#BBEBE1]">
                <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>You will receive a notification 3 days before each payment is due. Keep your vault funded.</p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-[4px] border border-[#2a2a26] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !form.name || !form.amount || !form.recipient || !form.nextDue} className="flex-1 rounded-[4px] bg-[#BBEBE1] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Adding..." : "Add Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
