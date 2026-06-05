"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle, ChevronDown, EyeOff, Plus, Users, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

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

const mainnetItems = [
  {
    icon: CalendarClock,
    text: "Connect a timesheet API - Rialo contract verifies hours logged before releasing pay, no trust required",
  },
  {
    icon: CheckCircle,
    text: "Self-executing payroll - runs automatically on schedule without manual approval on Rialo testnet",
  },
  {
    icon: EyeOff,
    text: "Private payroll - individual salaries hidden on-chain via Rialo REX. Only the employer and contractor see their amount.",
  },
];

export default function PayrollPage() {
  const { authenticated, ready } = usePrivy();
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
      <Topbar />

      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="payroll" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-12 top-10 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            <div className="mb-8 pb-8 border-b border-[#2a2a26] flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-5xl font-bold text-cream tracking-tight">
                  Payroll
                </h1>
                <div className="w-12 h-1 bg-mint rounded-full mt-3 mb-4" />
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
                  Pay your remote contractors in USDC or USDT on a fixed schedule. Add your team, set the pay date, and approve each cycle. Funds distribute instantly to all wallets simultaneously.
                </p>
                <p className="mt-3 text-sm text-muted">
                  All contractors must have a Rialo network wallet address.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-all hover:bg-cream hover:shadow-[0_0_20px_rgba(187,235,225,0.15)]"
              >
                <Plus className="h-4 w-4" />
                New Payroll
              </button>
            </div>

            <section className="mb-6 rounded-3xl border border-[#2a2a26] bg-gradient-to-br from-mint/5 to-transparent p-6 transition-colors hover:border-[#3a3a36]">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-mint/70">
                Coming on Rialo testnet
              </p>
              <div className="grid gap-4 lg:grid-cols-3">
                {mainnetItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex gap-3 rounded-2xl border border-[#2a2a26] bg-bg p-4">
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-mint" />
                      <p className="text-sm leading-6 text-muted">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {payrolls.length === 0 ? (
              <div className="rounded-3xl border border-[#2a2a26] bg-surface p-16 text-center transition-colors hover:border-[#3a3a36]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-mint/10">
                  <Users className="h-10 w-10 text-mint" />
                </div>
                <p className="mb-3 text-2xl font-bold text-cream">No payroll contracts yet</p>
                <p className="mx-auto mb-7 max-w-lg text-sm leading-6 text-muted">
                  Add your contractors, set a payment cycle, and approve your first payroll run.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-all hover:bg-cream hover:shadow-[0_0_20px_rgba(187,235,225,0.15)]"
                >
                  <Plus className="h-4 w-4" />
                  New Payroll
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {payrolls.map((payroll) => (
                  <div key={payroll.id} className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36]">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-cream">{payroll.name}</h3>
                        <p className="mt-1 text-sm capitalize text-muted">{payroll.interval} - Next pay: {payroll.nextPayDate}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        payroll.status === "active"
                          ? "border-mint/30 bg-mint/10 text-mint"
                          : "border-[#2a2a26] text-muted"
                      }`}>
                        {payroll.status === "active" ? "Active" : "Paused"}
                      </span>
                    </div>

                    <div className="mb-5 grid gap-2">
                      {payroll.contractors.map((contractor) => (
                        <div key={contractor.id} className="flex items-center justify-between rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-cream">{contractor.name}</p>
                            <p className="text-xs text-muted">{contractor.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-cream">{contractor.amount} {payroll.token}</p>
                            <p className="font-mono text-xs text-muted">{contractor.wallet.slice(0, 6)}...{contractor.wallet.slice(-4)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#2a2a26] pt-5">
                      <div>
                        <p className="text-xs text-muted">Total per cycle</p>
                        <p className="text-lg font-bold text-cream">{payroll.totalPayout} {payroll.token}</p>
                      </div>
                      <button type="button" className="flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-bg transition-colors hover:bg-cream">
                        <CheckCircle className="h-4 w-4" />
                        Approve & Pay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#2a2a26] bg-surface-2 p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-[#2a2a26] pb-5">
              <h2 className="text-2xl font-bold text-cream">New Payroll Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-full border border-[#2a2a26] p-2 text-muted transition-colors hover:border-mint hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">Payroll name</span>
                <input type="text" placeholder="e.g. Engineering team, Freelancers Q2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-muted">Token</span>
                  <div className="relative">
                    <select value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} className="w-full appearance-none rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 pr-10 text-cream outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20">
                      <option value="USDC">USDC</option>
                      <option value="USDT">USDT</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </label>
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-muted">Pay schedule</span>
                  <div className="relative">
                    <select value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} className="w-full appearance-none rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 pr-10 text-cream outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20">
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">First pay date</span>
                <input type="date" value={form.nextPayDate} onChange={(e) => setForm({ ...form, nextPayDate: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-cream outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-muted">Contractors</label>
                  <span className="text-xs text-muted">Total: {totalPayout.toFixed(2)} {form.token}</span>
                </div>
                <div className="space-y-3">
                  {form.contractors.map((contractor) => (
                    <div key={contractor.id} className="rounded-2xl border border-[#2a2a26] bg-bg p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold text-muted">Contractor</p>
                        {form.contractors.length > 1 && (
                          <button type="button" onClick={() => removeContractor(contractor.id)} className="text-muted transition-colors hover:text-red-400">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="mb-2 grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Full name" value={contractor.name} onChange={(e) => updateContractor(contractor.id, "name", e.target.value)} className="rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-sm text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
                        <input type="text" placeholder="Role" value={contractor.role} onChange={(e) => updateContractor(contractor.id, "role", e.target.value)} className="rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-sm text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
                      </div>
                      <div className="mb-2 grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Amount" value={contractor.amount} onChange={(e) => updateContractor(contractor.id, "amount", e.target.value)} className="rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-sm text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
                        <div className="flex items-center rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-sm text-muted">
                          {form.token}
                        </div>
                      </div>
                      <input type="text" placeholder="Wallet address (0x...)" value={contractor.wallet} onChange={(e) => updateContractor(contractor.id, "wallet", e.target.value)} className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 font-mono text-sm text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addContractor} className="mt-3 flex items-center gap-2 text-sm text-muted transition-colors hover:text-mint">
                  <Plus className="h-4 w-4" />
                  Add contractor
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-[#2a2a26] py-3 text-sm font-semibold text-muted transition-colors hover:border-mint hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !form.name || !form.nextPayDate} className="flex-1 rounded-full bg-mint py-3 text-sm font-bold text-bg transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Creating..." : "Create Payroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
