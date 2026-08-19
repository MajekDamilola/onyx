"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle, ChevronDown, EyeOff, Plus, Users, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { isValidAddress } from "@/lib/validation";

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
    text: "Connect a timesheet API — Rialo contract verifies hours logged before releasing pay, no trust required",
  },
  {
    icon: CheckCircle,
    text: "Self-executing payroll — runs automatically on schedule without manual approval on Rialo testnet",
  },
  {
    icon: EyeOff,
    text: "Private payroll — individual salaries hidden on-chain via Rialo REX. Only the employer and contractor see their amount.",
  },
];

export default function PayrollPage() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || "";
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

  useEffect(() => {
    if (!walletAddress) return;
    try {
      const saved = localStorage.getItem(`payrolls_${walletAddress}`);
      if (saved) setPayrolls(JSON.parse(saved));
    } catch {
      setPayrolls([]);
    }
  }, [walletAddress]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0A]">
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

  const isFormValid =
    !!form.name &&
    !!form.nextPayDate &&
    form.contractors.length > 0 &&
    form.contractors.every((c) => !!c.name && isValidAddress(c.wallet) && Number(c.amount) > 0);

  const handleCreate = async () => {
    if (!isFormValid) return;
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
    setPayrolls((prev) => {
      const updated = [newPayroll, ...prev];
      localStorage.setItem(`payrolls_${walletAddress}`, JSON.stringify(updated));
      return updated;
    });
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

  const inputCls = "w-full rounded-[8px] border border-[#252929] bg-[#090A0A] px-4 py-3 text-sm text-cream placeholder:text-muted outline-none transition-colors focus:border-[#BCEDE2]/40";

  return (
    <div className="min-h-screen bg-[#090A0A] text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="payroll" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#252929] pb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Contracts</p>
                <h1 className="text-4xl font-black tracking-tight text-cream">Payroll</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                  Pay your remote contractors in USDC or USDT on a fixed schedule. Add your team, set the pay date, and approve each cycle. Funds distribute instantly to all wallets simultaneously.
                </p>
                <p className="mt-2 text-xs text-muted">All contractors must have a Rialo network wallet address.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-[8px] bg-[#BCEDE2] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white"
              >
                <Plus className="h-3.5 w-3.5" />
                New Payroll
              </button>
            </div>

            {/* Coming soon */}
            <section className="mb-6 rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Coming on Rialo testnet</p>
              <div className="grid gap-3 lg:grid-cols-3">
                {mainnetItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex gap-3 rounded-[8px] border border-[#252929] bg-[#131515] p-4">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#BCEDE2]" />
                      <p className="text-xs leading-5 text-muted">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* List */}
            {payrolls.length === 0 ? (
              <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-16 text-center">
                <Users className="mx-auto mb-4 h-8 w-8 text-[#9A9E9B]" />
                <p className="mb-2 text-base font-bold text-cream">No payroll contracts yet</p>
                <p className="mx-auto mb-6 max-w-lg text-xs leading-5 text-muted">
                  Add your contractors, set a payment cycle, and approve your first payroll run.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 rounded-[8px] bg-[#BCEDE2] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Payroll
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {payrolls.map((payroll) => (
                  <div key={payroll.id} className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5 transition-colors hover:border-[#313737]">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-cream">{payroll.name}</h3>
                        <p className="mt-1 text-xs capitalize text-muted">{payroll.interval} · Next pay: {payroll.nextPayDate}</p>
                      </div>
                      <span className={`rounded-[6px] border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                        payroll.status === "active"
                          ? "border-[#BCEDE2]/30 bg-[#BCEDE2]/10 text-[#BCEDE2]"
                          : "border-[#252929] text-muted"
                      }`}>
                        {payroll.status === "active" ? "Active" : "Paused"}
                      </span>
                    </div>

                    <div className="mb-4 grid gap-1.5">
                      {payroll.contractors.map((contractor) => (
                        <div key={contractor.id} className="flex items-center justify-between rounded-[8px] border border-[#252929] bg-[#131515] px-3 py-2.5">
                          <div>
                            <p className="text-xs font-medium text-cream">{contractor.name}</p>
                            <p className="text-[10px] text-muted">{contractor.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-cream">{contractor.amount} {payroll.token}</p>
                            <p className="font-mono text-[10px] text-muted">{(contractor.wallet || "").slice(0, 6)}...{(contractor.wallet || "").slice(-4)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#252929] pt-4">
                      <div>
                        <p className="text-[10px] text-muted">Total per cycle</p>
                        <p className="text-base font-black tracking-tight text-cream">{payroll.totalPayout} {payroll.token}</p>
                      </div>
                      <button
                        type="button"
                        disabled
                        title="Coming on Rialo testnet — executing a payroll run activates with the Rialo network integration"
                        className="flex cursor-not-allowed items-center gap-2 rounded-[8px] bg-[#BCEDE2]/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#BCEDE2]/30"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
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

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[12px] border border-[#252929] bg-[#0E1010] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-[#252929] pb-4">
              <h2 className="text-lg font-black tracking-tight text-cream">New Payroll Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-[6px] border border-[#252929] p-1.5 text-muted transition-colors hover:text-cream">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Payroll name</span>
                <input type="text" placeholder="e.g. Engineering team, Freelancers Q2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </label>

              <div className="grid grid-cols-2 gap-3">
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
                <label>
                  <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Pay schedule</span>
                  <div className="relative">
                    <select value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} className={`${inputCls} appearance-none pr-10`}>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">First pay date</span>
                <input type="date" value={form.nextPayDate} onChange={(e) => setForm({ ...form, nextPayDate: e.target.value })} className={inputCls} />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Contractors</label>
                  <span className="text-[11px] text-muted">Total: {totalPayout.toFixed(2)} {form.token}</span>
                </div>
                <div className="space-y-2">
                  {form.contractors.map((contractor) => (
                    <div key={contractor.id} className="rounded-[8px] border border-[#252929] bg-[#131515] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Contractor</p>
                        {form.contractors.length > 1 && (
                          <button type="button" onClick={() => removeContractor(contractor.id)} className="text-muted transition-colors hover:text-red-400">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="mb-1.5 grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Full name" value={contractor.name} onChange={(e) => updateContractor(contractor.id, "name", e.target.value)} className={inputCls} />
                        <input type="text" placeholder="Role" value={contractor.role} onChange={(e) => updateContractor(contractor.id, "role", e.target.value)} className={inputCls} />
                      </div>
                      <div className="mb-1.5 grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Amount" value={contractor.amount} onChange={(e) => updateContractor(contractor.id, "amount", e.target.value)} className={inputCls} />
                        <div className="flex items-center rounded-[8px] border border-[#252929] bg-[#090A0A] px-4 py-3 text-xs text-muted">
                          {form.token}
                        </div>
                      </div>
                      <input type="text" placeholder="Wallet address (0x...)" value={contractor.wallet} onChange={(e) => updateContractor(contractor.id, "wallet", e.target.value)} className={`${inputCls} font-mono`} />
                      {contractor.wallet.length > 0 && !isValidAddress(contractor.wallet) && (
                        <p className="mt-1.5 text-[10px] text-red-400">Enter a valid wallet address (0x followed by 40 hex characters)</p>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addContractor} className="mt-3 flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-[#BCEDE2]">
                  <Plus className="h-3.5 w-3.5" />
                  Add contractor
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-[8px] border border-[#252929] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !isFormValid} className="flex-1 rounded-[8px] bg-[#BCEDE2] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Creating..." : "Create Payroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
