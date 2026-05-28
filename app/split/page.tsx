"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Copy, EyeOff, GitBranch, Plus, Radar, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

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
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
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

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
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

  const handleCreate = async () => {
    if (!form.name || totalPercentage !== 100) return;
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
    setSplits((prev) => [newSplit, ...prev]);
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

  return (
    <div className="min-h-screen bg-bg text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="split" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-12 top-10 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-4 h-1 w-14 rounded-full bg-mint shadow-[0_0_24px_rgba(187,235,225,0.45)]" />
                <h1 className="text-4xl font-bold tracking-tight text-cream sm:text-5xl">
                  Split
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
                  Create a shared USDC or USDT payment address. Any funds sent to that address are instantly and automatically split between all parties based on pre-set percentages. No manual distribution needed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-colors hover:bg-cream"
              >
                <Plus className="h-4 w-4" />
                New Split
              </button>
            </div>

            <section className="mb-8 rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">
                Coming on Rialo mainnet
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="flex gap-3 rounded-2xl border border-[#2a2a26] bg-bg p-4">
                  <EyeOff className="mt-1 h-5 w-5 shrink-0 text-mint" />
                  <p className="text-sm leading-6 text-muted">
                    <span className="font-semibold text-cream">REX privacy</span> - split percentages and individual amounts stay hidden on-chain. Only the parties involved can see the terms.
                  </p>
                </div>
                <div className="flex gap-3 rounded-2xl border border-[#2a2a26] bg-bg p-4">
                  <Radar className="mt-1 h-5 w-5 shrink-0 text-mint" />
                  <p className="text-sm leading-6 text-muted">
                    <span className="font-semibold text-cream">Auto-detection</span> - Rialo contract detects incoming payments from connected wallets and triggers the split automatically without anyone sending manually.
                  </p>
                </div>
              </div>
            </section>

            {splits.length === 0 ? (
              <>
                <div className="rounded-3xl border border-[#2a2a26] bg-surface p-12 text-center transition-colors hover:border-[#3a3a36]">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mint/10">
                    <GitBranch className="h-10 w-10 text-mint" />
                  </div>
                  <p className="mb-3 text-2xl font-bold text-cream">No split contracts yet</p>
                  <p className="mx-auto mb-7 max-w-lg text-sm leading-6 text-muted">
                    Create a split address, share it, and let every incoming payment distribute automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-colors hover:bg-cream"
                  >
                    <Plus className="h-4 w-4" />
                    New Split
                  </button>
                </div>
                <p className="mt-5 text-sm text-muted">
                  Anyone with a wallet address can send USDC or USDT to your split address - they don't need to be on Rialo.
                </p>
              </>
            ) : (
              <div className="grid gap-4">
                {splits.map((split) => (
                  <div key={split.id} className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36]">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-cream">{split.name}</h3>
                        <p className="mt-1 text-xs text-muted">Created {split.createdAt}</p>
                      </div>
                      <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
                        {split.token}
                      </span>
                    </div>

                    <div className="mb-5 rounded-2xl border border-[#2a2a26] bg-bg p-4">
                      <p className="mb-1 text-xs text-muted">Payment address</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-mono text-sm text-cream">{split.contractAddress}</p>
                        <button type="button" onClick={() => handleCopy(split.contractAddress, split.id)} className="shrink-0 text-muted transition-colors hover:text-mint">
                          {copied === split.id ? <Check className="h-4 w-4 text-mint" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {split.parties.map((party, i) => (
                        <div key={i} className="flex items-center justify-between rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-cream">{party.name || "Party " + (i + 1)}</p>
                            <p className="font-mono text-xs text-muted">{party.wallet.slice(0, 6)}...{party.wallet.slice(-4)}</p>
                          </div>
                          <span className="text-sm font-bold text-mint">{party.percentage}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#2a2a26] pt-5">
                      <p className="text-sm text-muted">Total received</p>
                      <p className="font-bold text-cream">{split.totalReceived} {split.token}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#2a2a26] bg-surface p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cream">New Split Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-full border border-[#2a2a26] p-2 text-muted transition-colors hover:border-mint hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-cream">Split name</span>
                <input type="text" placeholder="e.g. Agency client payment, Partner split" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-cream">Token</span>
                <select value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint">
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-cream">Parties</label>
                  <span className={`text-xs font-semibold ${totalPercentage === 100 ? "text-mint" : "text-red-400"}`}>
                    {totalPercentage}% / 100%
                  </span>
                </div>
                <div className="space-y-3">
                  {form.parties.map((party, index) => (
                    <div key={index} className="rounded-2xl border border-[#2a2a26] bg-bg p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold text-muted">Party {index + 1}</p>
                        {form.parties.length > 2 && (
                          <button type="button" onClick={() => removeParty(index)} className="text-muted transition-colors hover:text-red-400">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="mb-2 grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Name" value={party.name} onChange={(e) => updateParty(index, "name", e.target.value)} className="rounded-2xl border border-[#2a2a26] bg-surface px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-mint" />
                        <input type="text" placeholder="% share" value={party.percentage} onChange={(e) => updateParty(index, "percentage", e.target.value)} className="rounded-2xl border border-[#2a2a26] bg-surface px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-mint" />
                      </div>
                      <input type="text" placeholder="Wallet address (0x...)" value={party.wallet} onChange={(e) => updateParty(index, "wallet", e.target.value)} className="w-full rounded-2xl border border-[#2a2a26] bg-surface px-4 py-3 font-mono text-sm text-cream outline-none transition-colors focus:border-mint" />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addParty} className="mt-3 flex items-center gap-2 text-sm text-muted transition-colors hover:text-mint">
                  <Plus className="h-4 w-4" />
                  Add another party
                </button>
              </div>

              {totalPercentage !== 100 && totalPercentage > 0 && (
                <p className="text-xs text-red-400">Percentages must add up to exactly 100%</p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-[#2a2a26] py-3 text-sm font-semibold text-muted transition-colors hover:border-mint hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !form.name || totalPercentage !== 100} className="flex-1 rounded-full bg-mint py-3 text-sm font-bold text-bg transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Creating..." : "Create Split"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
