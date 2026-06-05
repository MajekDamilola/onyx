"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, CheckSquare, ChevronDown, Clock, FolderOpen, GitBranch, GitPullRequest, Plus, Shield, UploadCloud, X, Zap } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

type EscrowStatus = "active" | "completed" | "disputed";

interface EscrowContract {
  id: string;
  title: string;
  freelancer: string;
  amount: string;
  token: string;
  status: EscrowStatus;
  milestone: string;
  createdAt: string;
  disputeWindow?: string;
}

const mockEscrows: EscrowContract[] = [];

export default function EscrowPage() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    freelancerAddress: string;
    amount: string;
    token: string;
    milestone: string;
    deliveryMethod: "github" | "drive" | "manual";
    repoUrl: string;
    driveFolderUrl: string;
  }>({
    title: "",
    freelancerAddress: "",
    amount: "",
    token: "USDC",
    milestone: "",
    deliveryMethod: "github",
    repoUrl: "",
    driveFolderUrl: "",
  });
  const [escrows, setEscrows] = useState<EscrowContract[]>(mockEscrows);
  const [creating, setCreating] = useState(false);

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
    if (!form.title || !form.freelancerAddress || !form.amount || !form.milestone) return;
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newEscrow: EscrowContract = {
      id: Math.random().toString(36).slice(2, 9),
      title: form.title,
      freelancer: form.freelancerAddress,
      amount: form.amount,
      token: form.token,
      status: "active",
      milestone: form.milestone,
      createdAt: new Date().toLocaleDateString(),
      disputeWindow: "48 hours",
    };
    setEscrows((prev) => [newEscrow, ...prev]);
    setForm({ title: "", freelancerAddress: "", amount: "", token: "USDC", milestone: "", deliveryMethod: "github", repoUrl: "", driveFolderUrl: "" });
    setCreating(false);
    setShowCreate(false);
  };

  const statusConfig = {
    active: { label: "Active", icon: Clock, color: "text-mint border-mint/30 bg-mint/10" },
    completed: { label: "Completed", icon: CheckCircle, color: "text-green-400 border-green-400/30 bg-green-400/10" },
    disputed: { label: "Disputed", icon: AlertCircle, color: "text-red-400 border-red-400/30 bg-red-400/10" },
  };

  return (
    <div className="min-h-screen bg-bg text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="escrow" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-12 top-10 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-cream tracking-tight">
                  Escrow
                </h1>
                <div className="w-12 h-1 bg-mint rounded-full mt-3 mb-4" />
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
                  Lock funds for a freelancer or contractor. Once they mark the milestone complete, you have 48 hours to raise a dispute. No dispute means automatic release. No middleman.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-all hover:bg-cream hover:shadow-[0_0_20px_rgba(187,235,225,0.15)]"
              >
                <Plus className="h-4 w-4" />
                New Escrow
              </button>
            </div>

            <div className="mb-5 flex items-start gap-4 rounded-2xl border border-mint/25 bg-mint/[0.08] p-5 text-mint">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint/10">
                <Shield className="h-6 w-6" />
              </div>
              <p className="text-sm leading-relaxed">
                On Rialo mainnet, Rialo IPC automatically screens both wallet addresses for sanctions compliance before funds are locked. Escrow terms and amounts stay private via REX.
              </p>
            </div>

            <section className="mb-8 rounded-3xl border border-[#2a2a26] border-l-mint bg-surface p-6 transition-colors hover:border-[#3a3a36] hover:border-l-mint">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mint/70">
                    Coming on Rialo mainnet
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-cream">Automation hooks</h2>
                </div>
                <span className="w-max rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
                  Powered by Rialo
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border-l-2 border-mint/40 pl-4">
                  <div className="rounded-2xl border border-[#2a2a26] bg-bg p-4 transition-colors hover:bg-surface-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
                      <GitPullRequest className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-cream">GitHub PR merge</p>
                    <p className="mt-1 text-sm text-muted">
                      Contract calls GitHub API directly, no manual trigger needed.
                    </p>
                  </div>
                </div>
                <div className="border-l-2 border-mint/40 pl-4">
                  <div className="rounded-2xl border border-[#2a2a26] bg-bg p-4 transition-colors hover:bg-surface-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-cream">Delivery detection</p>
                    <p className="mt-1 text-sm text-muted">
                      Contract detects file upload and starts the dispute window automatically.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {escrows.length === 0 ? (
              <div className="rounded-3xl border border-[#2a2a26] bg-surface p-16 text-center transition-colors hover:border-[#3a3a36]">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-mint/10">
                  <Shield className="h-10 w-10 text-mint" />
                </div>
                <p className="mb-3 text-2xl font-bold text-cream">No escrow contracts yet</p>
                <p className="mx-auto mb-7 max-w-lg text-sm leading-6 text-muted">
                  Create your first escrow to lock funds for a contractor and start a structured milestone flow.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-bg transition-all hover:bg-cream hover:shadow-[0_0_20px_rgba(187,235,225,0.15)]"
                >
                  <Plus className="h-4 w-4" />
                  New Escrow
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {escrows.map((escrow) => {
                  const { label, icon: Icon, color } = statusConfig[escrow.status];
                  return (
                    <div key={escrow.id} className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-cream">{escrow.title}</h3>
                          <p className="mt-1 font-mono text-sm text-muted">{escrow.freelancer.slice(0, 6)}...{escrow.freelancer.slice(-4)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>
                          <Icon className="h-3 w-3" />
                          {label}
                        </span>
                      </div>
                      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-4">
                        <div><p className="text-muted">Amount</p><p className="font-semibold text-cream">{escrow.amount} {escrow.token}</p></div>
                        <div><p className="text-muted">Milestone</p><p className="font-semibold text-cream">{escrow.milestone}</p></div>
                        <div><p className="text-muted">Created</p><p className="font-semibold text-cream">{escrow.createdAt}</p></div>
                        <div><p className="text-muted">Dispute window</p><p className="font-semibold text-cream">{escrow.disputeWindow}</p></div>
                      </div>
                      {escrow.status === "active" && (
                        <div className="mt-5 flex gap-2">
                          <button type="button" className="rounded-full border border-mint px-4 py-2 text-xs font-semibold text-mint transition-colors hover:bg-mint hover:text-bg">
                            Mark Complete
                          </button>
                          <button type="button" className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-400/10">
                            Open Dispute
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#2a2a26] bg-surface p-5 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#2a2a26] pb-4">
              <h2 className="text-2xl font-bold text-cream">New Escrow Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-full border border-[#2a2a26] p-2 text-muted transition-colors hover:border-mint hover:text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">Contract title</span>
                <input type="text" placeholder="e.g. Website redesign milestone 1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">Freelancer wallet address</span>
                <input type="text" placeholder="0x..." value={form.freelancerAddress} onChange={(e) => setForm({ ...form, freelancerAddress: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 font-mono text-sm text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="mb-1.5 block text-sm font-medium text-muted">Amount</span>
                  <input type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
                </label>
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
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-muted">Milestone description</span>
                <textarea placeholder="e.g. Complete homepage design and deliver Figma files" value={form.milestone} onChange={(e) => setForm({ ...form, milestone: e.target.value })} rows={2} className="w-full resize-none rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20" />
              </label>

              <div>
                <span className="mb-2 block text-sm font-medium text-muted">Delivery method</span>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "github", icon: GitBranch, label: "GitHub PR merge", desc: "Auto-release when PR is merged" },
                    { key: "drive", icon: FolderOpen, label: "Google Drive", desc: "Auto-release when files are delivered" },
                    { key: "manual", icon: CheckSquare, label: "Manual", desc: "Freelancer marks complete manually" },
                  ] as const).map(({ key, icon: Icon, label, desc }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryMethod: key })}
                      className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left cursor-pointer transition-colors ${
                        form.deliveryMethod === key
                          ? "border-mint bg-mint/5 text-mint"
                          : "border-[#2a2a26] text-muted hover:border-[#3a3a36]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-semibold leading-tight">{label}</span>
                      <span className={`text-xs leading-tight ${form.deliveryMethod === key ? "text-mint/70" : "text-muted"}`}>{desc}</span>
                    </button>
                  ))}
                </div>

                {form.deliveryMethod === "github" && (
                  <div className="mt-3">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-muted">GitHub repository URL</span>
                      <input
                        type="text"
                        placeholder="https://github.com/username/repo"
                        value={form.repoUrl}
                        onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                        className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20"
                      />
                    </label>
                    <p className="mt-1.5 text-xs text-muted">On Rialo testnet, the contract will watch this repo for merged PRs</p>
                  </div>
                )}

                {form.deliveryMethod === "drive" && (
                  <div className="mt-3">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-muted">Google Drive folder URL</span>
                      <input
                        type="text"
                        placeholder="https://drive.google.com/drive/folders/..."
                        value={form.driveFolderUrl}
                        onChange={(e) => setForm({ ...form, driveFolderUrl: e.target.value })}
                        className="w-full rounded-2xl border border-[#2a2a26] bg-[#141414] px-4 py-3.5 text-cream placeholder:text-muted outline-none transition-all focus:border-mint focus:ring-1 focus:ring-mint/20"
                      />
                    </label>
                    <p className="mt-1.5 text-xs text-muted">On Rialo testnet, the contract will detect new file uploads to this folder</p>
                  </div>
                )}

                {form.deliveryMethod === "manual" && (
                  <p className="mt-3 text-xs text-muted">The freelancer will mark the milestone complete manually. The 48-hour dispute window starts immediately after.</p>
                )}
              </div>

              <div className="flex items-start gap-2 rounded-2xl border border-mint/20 bg-mint/5 p-3 text-xs leading-5 text-mint">
                <Zap className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Funds lock on Sepolia. After delivery, the 48-hour dispute window starts before automatic release.</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-surface pt-3 pb-1 mt-3 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-[#2a2a26] py-3 text-sm font-semibold text-muted transition-colors hover:border-mint hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !form.title || !form.freelancerAddress || !form.amount || !form.milestone} className="flex-1 rounded-full bg-mint py-3 text-sm font-bold text-bg transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Creating..." : "Create Escrow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
