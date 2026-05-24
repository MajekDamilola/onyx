"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GitBranch, Plus, X, Copy, Check } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Send & Receive", href: "/send" },
  { label: "divider-1", href: "#", divider: true },
  { label: "Escrow", href: "/escrow" },
  { label: "AutoPay", href: "/autopay" },
  { label: "Split", href: "/split", active: true },
  { label: "Payroll", href: "/payroll" },
  { label: "divider-2", href: "#", divider: true },
  { label: "Activity", href: "/activity" },
  { label: "Settings", href: "/settings" },
];

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
  const { authenticated, ready, user, logout } = usePrivy();
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
              <h1 className="text-3xl font-bold text-cream">Split</h1>
              <p className="mt-2 text-muted max-w-xl">
                Create a shared payment address. Any funds sent to it are instantly split between all parties based on set percentages.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-bg transition hover:bg-cream shrink-0"
            >
              <Plus className="h-4 w-4" />
              New Split
            </button>
          </div>

          {splits.length === 0 ? (
            <div className="rounded-2xl border border-[#2a2a26] bg-surface p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint/10">
                <GitBranch className="h-7 w-7 text-mint" />
              </div>
              <p className="mb-2 font-medium text-cream">No split contracts yet</p>
              <p className="mb-6 text-sm text-muted">Create a split address and share it — payments distribute automatically</p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-bg transition hover:bg-cream"
              >
                <Plus className="h-4 w-4" />
                New Split
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {splits.map((split) => (
                <div key={split.id} className="rounded-2xl border border-[#2a2a26] bg-surface p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-cream">{split.name}</h3>
                      <p className="text-xs text-muted mt-1">Created {split.createdAt}</p>
                    </div>
                    <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
                      {split.token}
                    </span>
                  </div>

                  <div className="mb-4 rounded-xl border border-[#2a2a26] bg-bg p-3">
                    <p className="text-xs text-muted mb-1">Payment address</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-mono text-cream truncate">{split.contractAddress}</p>
                      <button
                        type="button"
                        onClick={() => handleCopy(split.contractAddress, split.id)}
                        className="shrink-0 text-muted hover:text-mint transition-colors"
                      >
                        {copied === split.id ? <Check className="h-4 w-4 text-mint" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {split.parties.map((party, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-[#2a2a26] bg-bg px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-cream">{party.name || "Party " + (i + 1)}</p>
                          <p className="text-xs font-mono text-muted">{party.wallet.slice(0, 6)}...{party.wallet.slice(-4)}</p>
                        </div>
                        <span className="text-sm font-bold text-mint">{party.percentage}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#2a2a26] flex items-center justify-between">
                    <p className="text-sm text-muted">Total received</p>
                    <p className="font-bold text-cream">{split.totalReceived} {split.token}</p>
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
              <h2 className="text-xl font-bold text-cream">New Split Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="text-muted hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-cream">Split name</label>
                <input
                  type="text"
                  placeholder="e.g. Agency revenue split, Music royalties"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-muted">Party {index + 1}</p>
                        {form.parties.length > 2 && (
                          <button type="button" onClick={() => removeParty(index)} className="text-muted hover:text-red-400">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={party.name}
                          onChange={(e) => updateParty(index, "name", e.target.value)}
                          className="rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm text-cream outline-none focus:border-mint"
                        />
                        <input
                          type="text"
                          placeholder="% share"
                          value={party.percentage}
                          onChange={(e) => updateParty(index, "percentage", e.target.value)}
                          className="rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm text-cream outline-none focus:border-mint"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Wallet address (0x...)"
                        value={party.wallet}
                        onChange={(e) => updateParty(index, "wallet", e.target.value)}
                        className="w-full rounded-xl border border-[#2a2a26] bg-surface px-3 py-2 text-sm font-mono text-cream outline-none focus:border-mint"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addParty}
                  className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-mint transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add another party
                </button>
              </div>

              {totalPercentage !== 100 && totalPercentage > 0 && (
                <p className="text-xs text-red-400">Percentages must add up to exactly 100%</p>
              )}
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
                disabled={creating || !form.name || totalPercentage !== 100}
                className="flex-1 rounded-full bg-mint py-3 text-sm font-bold text-bg transition hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Split"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}