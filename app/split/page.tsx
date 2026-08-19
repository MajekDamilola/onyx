"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy, EyeOff, GitBranch, Plus, Radar, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { isValidAddress } from "@/lib/validation";

interface Party {
  name: string;
  wallet: string;
  percentage: string;
}

interface SplitContract {
  id: string;
  name: string;
  parties: Party[];
  token: string;
  totalReceived: string;
  contractAddress: string;
  createdAt: string;
}

export default function SplitPage() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || "";
  const [showCreate, setShowCreate] = useState(false);
  const [splits, setSplits] = useState<SplitContract[]>([]);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    token: "USDC",
    parties: [
      { name: "", wallet: "", percentage: "" },
      { name: "", wallet: "", percentage: "" },
    ] as Party[],
  });

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!walletAddress) return;
    try {
      const saved = localStorage.getItem(`splits_${walletAddress}`);
      if (saved) setSplits(JSON.parse(saved));
    } catch {
      setSplits([]);
    }
  }, [walletAddress]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0A]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const totalPercentage = form.parties.reduce(
    (sum, p) => sum + (parseFloat(p.percentage) || 0), 0
  );

  const addParty = () => {
    setForm({ ...form, parties: [...form.parties, { name: "", wallet: "", percentage: "" }] });
  };

  const removeParty = (index: number) => {
    setForm({ ...form, parties: form.parties.filter((_, i) => i !== index) });
  };

  const updateParty = (index: number, field: keyof Party, value: string) => {
    const updated = [...form.parties];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, parties: updated });
  };

  const partiesValid = form.parties.every((p) => isValidAddress(p.wallet));
  const isFormValid = !!form.name && totalPercentage === 100 && partiesValid;

  const handleCreate = async () => {
    if (!isFormValid) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newSplit: SplitContract = {
      id: Math.random().toString(36).slice(2, 9),
      name: form.name,
      parties: form.parties,
      token: form.token,
      totalReceived: "0.00",
      contractAddress: "0x" + Math.random().toString(36).slice(2, 42).padEnd(40, "0"),
      createdAt: new Date().toLocaleDateString(),
    };
    setSplits((prev) => {
      const updated = [newSplit, ...prev];
      localStorage.setItem(`splits_${walletAddress}`, JSON.stringify(updated));
      return updated;
    });
    setForm({
      name: "",
      token: "USDC",
      parties: [
        { name: "", wallet: "", percentage: "" },
        { name: "", wallet: "", percentage: "" },
      ],
    });
    setCreating(false);
    setShowCreate(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const inputCls = "w-full rounded-[8px] border border-[#252929] bg-[#090A0A] px-4 py-3 text-sm text-cream placeholder:text-muted outline-none transition-colors focus:border-[#BCEDE2]/40";

  return (
    <div className="min-h-screen bg-[#090A0A] text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="split" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#252929] pb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Contracts</p>
                <h1 className="text-4xl font-black tracking-tight text-cream">Split</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                  Create a shared USDC or USDT payment address. Any funds sent to that address are instantly and automatically split between all parties based on pre-set percentages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-[8px] bg-[#BCEDE2] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white"
              >
                <Plus className="h-3.5 w-3.5" />
                New Split
              </button>
            </div>

            {/* Coming soon */}
            <section className="mb-8 rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Coming on Rialo testnet</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex gap-3 rounded-[8px] border border-[#252929] bg-[#131515] p-4">
                  <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-[#BCEDE2]" />
                  <p className="text-xs leading-5 text-muted">
                    <span className="font-semibold text-cream">REX privacy</span> — split percentages and individual amounts stay hidden on-chain. Only the parties involved can see the terms.
                  </p>
                </div>
                <div className="flex gap-3 rounded-[8px] border border-[#252929] bg-[#131515] p-4">
                  <Radar className="mt-0.5 h-4 w-4 shrink-0 text-[#BCEDE2]" />
                  <p className="text-xs leading-5 text-muted">
                    <span className="font-semibold text-cream">Auto-detection</span> — Rialo contract detects incoming payments and triggers the split automatically without anyone sending manually.
                  </p>
                </div>
              </div>
            </section>

            {/* List */}
            {splits.length === 0 ? (
              <>
                <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-16 text-center">
                  <GitBranch className="mx-auto mb-4 h-8 w-8 text-[#9A9E9B]" />
                  <p className="mb-2 text-base font-bold text-cream">No split contracts yet</p>
                  <p className="mx-auto mb-6 max-w-lg text-xs leading-5 text-muted">
                    Create a split address, share it, and let every incoming payment distribute automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#BCEDE2] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Split
                  </button>
                </div>
                <p className="mt-4 text-xs text-muted">
                  Anyone with a wallet address can send USDC or USDT to your split address — they don't need to be on Rialo.
                </p>
              </>
            ) : (
              <div className="grid gap-3">
                {splits.map((split) => (
                  <div key={split.id} className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5 transition-colors hover:border-[#313737]">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-cream">{split.name}</h3>
                        <p className="mt-1 text-xs text-muted">Created {split.createdAt}</p>
                      </div>
                      <span className="rounded-[6px] border border-[#BCEDE2]/30 bg-[#BCEDE2]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#BCEDE2]">
                        {split.token}
                      </span>
                    </div>

                    <div className="mb-4 rounded-[8px] border border-[#252929] bg-[#131515] p-3">
                      <p className="mb-1 text-[10px] text-muted">Payment address</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-mono text-xs text-cream">{split.contractAddress}</p>
                        <button type="button" onClick={() => handleCopy(split.contractAddress, split.id)} className="shrink-0 text-muted transition-colors hover:text-[#BCEDE2]">
                          {copied === split.id ? <Check className="h-3.5 w-3.5 text-[#BCEDE2]" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-1.5">
                      {split.parties.map((party, i) => (
                        <div key={i} className="flex items-center justify-between rounded-[8px] border border-[#252929] bg-[#131515] px-3 py-2">
                          <div>
                            <p className="text-xs font-medium text-cream">{party.name || "Party " + (i + 1)}</p>
                            <p className="font-mono text-[10px] text-muted">{(party.wallet || "").slice(0, 6)}...{(party.wallet || "").slice(-4)}</p>
                          </div>
                          <span className="text-xs font-bold text-[#BCEDE2]">{party.percentage}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#252929] pt-4">
                      <p className="text-xs text-muted">Total received</p>
                      <p className="text-sm font-bold text-cream">{split.totalReceived} {split.token}</p>
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
              <h2 className="text-lg font-black tracking-tight text-cream">New Split Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-[6px] border border-[#252929] p-1.5 text-muted transition-colors hover:text-cream">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Split name</span>
                <input type="text" placeholder="e.g. Agency client payment, Partner split" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Token</span>
                <div className="relative">
                  <select value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} className={`${inputCls} appearance-none pr-10`}>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Parties</label>
                  <span className={`text-[11px] font-semibold ${totalPercentage === 100 ? "text-[#BCEDE2]" : "text-red-400"}`}>
                    {totalPercentage}% / 100%
                  </span>
                </div>
                <div className="space-y-2">
                  {form.parties.map((party, index) => (
                    <div key={index} className="rounded-[8px] border border-[#252929] bg-[#131515] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Party {index + 1}</p>
                        {form.parties.length > 2 && (
                          <button type="button" onClick={() => removeParty(index)} className="text-muted transition-colors hover:text-red-400">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="mb-1.5 grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Name" value={party.name} onChange={(e) => updateParty(index, "name", e.target.value)} className={inputCls} />
                        <input type="text" placeholder="% share" value={party.percentage} onChange={(e) => updateParty(index, "percentage", e.target.value)} className={inputCls} />
                      </div>
                      <input type="text" placeholder="Wallet address (0x...)" value={party.wallet} onChange={(e) => updateParty(index, "wallet", e.target.value)} className={`${inputCls} font-mono`} />
                      {party.wallet.length > 0 && !isValidAddress(party.wallet) && (
                        <p className="mt-1.5 text-[10px] text-red-400">Enter a valid wallet address (0x followed by 40 hex characters)</p>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addParty} className="mt-3 flex items-center gap-1.5 text-[11px] text-muted transition-colors hover:text-[#BCEDE2]">
                  <Plus className="h-3.5 w-3.5" />
                  Add another party
                </button>
              </div>

              {totalPercentage !== 100 && totalPercentage > 0 && (
                <p className="text-[10px] text-red-400">Percentages must add up to exactly 100%</p>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-[8px] border border-[#252929] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !isFormValid} className="flex-1 rounded-[8px] bg-[#BCEDE2] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Creating..." : "Create Split"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
