"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Users, Plus, X, CheckCircle, Clock } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Send & Receive", href: "/send" },
  { label: "divider-1", href: "#", divider: true },
  { label: "Escrow", href: "/escrow" },
  { label: "AutoPay", href: "/autopay" },
  { label: "Split", href: "/split" },
  { label: "Payroll", href: "/payroll", active: true },
  { label: "divider-2", href: "#", divider: true },
  { label: "Activity", href: "/activity" },
  { label: "Settings", href: "/settings" },
];

interface Contractor {
  id: string;
  name: string;
  wallet: string;
  amount: string;
  token: string;
  role: string;
}

interface PayrollContract {
  id: string;
  name: string;
  contractors: Contractor[];
  interval: "weekly" | "biweekly" | "monthly";
  nextPayDate: string;
  status: "active" | "paused";
  totalPayout: string;
  token: string;
  createdAt: string;
}

export default function PayrollPage() {
  const { authenticated, ready, user, logout } = usePrivy();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [payrolls, setPayrolls] = useState<PayrollContract[]>([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    token: "USDC",
    interval: "monthly",
    nextPayDate: "",
    contractors: [
      { id: "1", name: "", wallet: "", amount: "", token: "USDC", role: "" },
    ] as Contractor[],
  });

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const totalPayout = form.contractors.reduce(
    (sum, c) => sum + (parseFloat(c.amount) || 0), 0
  );

  const addContractor = () => {
    setForm({
      ...form,
      contractors: [
        ...form.contractors,
        { id: Math.random().toString(36).slice(2, 9), name: "", wallet: "", amount: "", token: "USDC", role: "" },
      ],
    });
  };

  const removeContractor = (id: string) => {
    setForm({ ...form, contractors: form.contractors.filter((c) => c.id !== id) });
  };

  const updateContractor = (id: string, field: keyof Contractor, value: string) => {
    setForm({
      ...form,
      contractors: form.contractors.map((c) => c.id === id ? { ...c, [field]: value } : c),
    });
  };

  const handleCreate = async () => {
    if (!form.name || !form.nextPayDate || form.contractors.some(c => !c.name || !c.wallet || !c.amount)) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newPayroll: PayrollContract = {
      id: Math.random().toString(36).slice(2, 9),
      name: form.name,
      contractors: form.contractors,
      interval: form.interval as PayrollContract["interval"],
      nextPayDate: form.nextPayDate,
      status: "active",
      totalPayout: totalPayout.toFixed(2),
      token: form.token,
      createdAt: new Date().toLocaleDateString(),
    };
    setPayrolls((prev) => [newPayroll, ...prev]);
    setForm({
      name: "",
      token: "USDC",
      interval: "monthly",
      nextPayDate: "",
      contractors: [{ id: "1", name: "", wallet: "", amount: "", token: "USDC", role: "" }],
    });
    setCreating(false);
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-bg text-cream">
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

        <div className="flex-1 overflow-auto p-5 sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cream">Payroll</h1>
              <p className="mt-2 text-muted max-w-xl">
                Pay your remote team automatically in USDC or USDT. Set the schedule, add contractors, approve each cycle and funds distribute instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-bg transition hover:bg-cream shrink-0"
            >
              <Plus className="h-4 w-4" />
              New Payroll
            </button>
          </div>

          {/* Coming Soon Rialo section */}
          <div className="mb-6 rounded-2xl border border-[#2a2a26] bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-mint mb-3">Coming on Rialo mainnet</p>
            <div className="grid gap-3 sm:grid-cols-3 text-sm text-muted">
              <div className="flex items-start gap-2">
                <span className="text-mint mt-0.5">→</span>
                <p>Connect Toggl or any timesheet API — auto-verify hours before paying</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-mint mt-0.5">→</span>
                <p>Self-executing payroll — no manual approval needed, runs automatically</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-mint mt-0.5">→</span>
                <p>Private payroll amounts hidden on-chain via Rialo REX</p>
              </div>
            </div>
          </div>

          {payrolls.length === 0 ? (
            <div className="rounded-2xl border border-[#2a2a26] bg-surface p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint/10">
                <Users className="h-7 w-7 text-mint" />
              </div>
              <p className="mb-2 font-medium text-cream">No payroll contracts yet</p>
              <p className="mb-6 text-sm text-muted">Set up your first payroll to pay your team automatically</p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-bg transition hover:bg-cream"
              >
                <Plus className="h-4 w-4" />
                New Payroll
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {payrolls.map((payroll) => (
                <div key={payroll.id} className="rounded-2xl border border-[#2a2a26] bg-surface p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-cream">{payroll.name}</h3>
                      <p className="text-sm text-muted mt-1 capitalize">{payroll.interval} · Next pay: {payroll.nextPayDate}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      payroll.status === "active"
                        ? "border-mint/30 bg-mint/10 text-mint"
                        : "border-[#2a2a26] text-muted"
                    }`}>
                      {payroll.status === "active" ? "Active" : "Paused"}
                    </span>
                  </div>

                  <div className="grid gap-2 mb-4">
                    {payroll.contractors.map((contractor, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-[#2a2a26] bg-bg px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-cream">{contractor.name}</p>
                          <p className="text-xs text-muted">{contractor.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-cream">{contractor.amount} {payroll.token}</p>
                          <p className="text-xs font-mono text-muted">{contractor.wallet.slice(0, 6)}...{contractor.wallet.slice(-4)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a26]">
                    <div>
                      <p className="text-xs text-muted">Total per cycle</p>
                      <p className="text-lg font-bold text-cream">{payroll.totalPayout} {payroll.token}</p>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full bg-mint px-5 py-2 text-sm font-bold text-bg transition hover:bg-cream"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve & Pay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#2a2a26] bg-surface p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cream">New Payroll Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="text-muted hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-cream">Payroll name</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering team, Freelancers Q2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="mb-2 block text-sm font-semibold text-cream">Pay schedule</label>
                  <select
                    value={form.interval}
                    onChange={(e) => setForm({ ...form, interval: e.target.value })}
                    className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-cream">First pay date</label>
                <input
                  type="date"
                  value={form.nextPayDate}
                  onChange={(e) => setForm({ ...form, nextPayDate: e.target.value })}
                  className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-cream">Contractors</label>
                  <span className="text-xs text-muted">Total: {totalPayout.toFixed(2)} {form.token}</span>
                </div>
                <div className="space-y-3">
                  {form.contractors.map((contractor) => (
                    <div key={contractor.id} className="rounded-2xl border border-[#2a2a26] bg-bg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-muted">Contractor</p>
                        {form.contractors.length > 1 && (
                          <button type="button" onClick={() => removeContractor(contractor.id)} className="text-muted hover:text-red-400">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Full name"
                          value={contractor.name}
                          onChange={(e) => updateContractor(contractor.id, "name", e.target.value)}
                          className="rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm text-cream outline-none focus:border-mint"
                        />
                        <input
                          type="text"
                          placeholder="Role"
                          value={contractor.role}
                          onChange={(e) => updateContractor(contractor.id, "role", e.target.value)}
                          className="rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm text-cream outline-none focus:border-mint"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={contractor.amount}
                          onChange={(e) => updateContractor(contractor.id, "amount", e.target.value)}
                          className="rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm text-cream outline-none focus:border-mint"
                        />
                        <div className="rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm text-muted flex items-center">
                          {form.token}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Wallet address (0x...)"
                        value={contractor.wallet}
                        onChange={(e) => updateContractor(contractor.id, "wallet", e.target.value)}
                        className="w-full rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm font-mono text-cream outline-none focus:border-mint"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addContractor}
                  className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-mint transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add contractor
                </button>
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
                disabled={creating || !form.name || !form.nextPayDate}
                className="flex-1 rounded-full bg-mint py-3 text-sm font-bold text-bg transition hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Payroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}