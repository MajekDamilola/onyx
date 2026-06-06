"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, CheckSquare, ChevronDown, Clock, FolderOpen, GitBranch, GitPullRequest, Plus, Shield, UploadCloud, X } from "lucide-react";
import Link from "next/link";
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
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
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
    active:    { label: "Active",    icon: Clock,        color: "text-[#BBEBE1] border-[#BBEBE1]/30 bg-[#BBEBE1]/10" },
    completed: { label: "Completed", icon: CheckCircle,  color: "text-green-400 border-green-400/30 bg-green-400/10" },
    disputed:  { label: "Disputed",  icon: AlertCircle,  color: "text-red-400 border-red-400/30 bg-red-400/10" },
  };

  const inputCls = "w-full rounded-[4px] border border-[#2a2a26] bg-[#141414] px-4 py-3 text-sm text-cream placeholder:text-muted outline-none transition-colors focus:border-[#BBEBE1]/40";

  return (
    <div className="min-h-screen bg-[#141414] text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="escrow" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#2a2a26] pb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Contracts</p>
                <h1 className="text-4xl font-black tracking-tight text-cream">Escrow</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                  Lock funds for a freelancer or contractor. Once they mark the milestone complete, you have 48 hours to raise a dispute. No dispute means automatic release.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center gap-2 rounded-[4px] bg-[#BBEBE1] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-colors hover:bg-white"
              >
                <Plus className="h-3.5 w-3.5" />
                New Escrow
              </button>
            </div>

            {/* IPC notice */}
            <div className="mb-5 flex items-start gap-3 rounded-[6px] border border-[#BBEBE1]/20 bg-[#BBEBE1]/5 p-4 text-[#BBEBE1]">
              <Shield className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs leading-5">
                On Rialo testnet, Rialo IPC automatically screens both wallet addresses for sanctions compliance before funds are locked. Escrow terms and amounts stay private via REX.
              </p>
            </div>

            {/* Automation hooks */}
            <section className="mb-8 rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Coming on Rialo testnet</p>
                  <h2 className="mt-2 text-lg font-black tracking-tight text-cream">Automation hooks</h2>
                </div>
                <span className="w-max rounded-[3px] border border-[#BBEBE1]/25 bg-[#BBEBE1]/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#BBEBE1]">
                  Powered by Rialo
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border-l-2 border-[#BBEBE1]/30 pl-4">
                  <div className="rounded-[4px] border border-[#2a2a26] bg-[#242420] p-4">
                    <GitPullRequest className="h-4 w-4 text-[#BBEBE1]" />
                    <p className="mt-3 text-sm font-semibold text-cream">GitHub PR merge</p>
                    <p className="mt-1 text-xs leading-5 text-muted">Contract calls GitHub API directly, no manual trigger needed.</p>
                  </div>
                </div>
                <div className="border-l-2 border-[#BBEBE1]/30 pl-4">
                  <div className="rounded-[4px] border border-[#2a2a26] bg-[#242420] p-4">
                    <UploadCloud className="h-4 w-4 text-[#BBEBE1]" />
                    <p className="mt-3 text-sm font-semibold text-cream">Delivery detection</p>
                    <p className="mt-1 text-xs leading-5 text-muted">Contract detects file upload and starts the dispute window automatically.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* List */}
            {escrows.length === 0 ? (
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-16 text-center">
                <Shield className="mx-auto mb-4 h-8 w-8 text-[#6b6760]" />
                <p className="mb-2 text-base font-bold text-cream">No escrow contracts yet</p>
                <p className="mx-auto mb-6 max-w-lg text-xs leading-5 text-muted">
                  Create your first escrow to lock funds for a contractor and start a structured milestone flow.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#BBEBE1] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-colors hover:bg-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Escrow
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {escrows.map((escrow) => {
                  const { label, icon: Icon, color } = statusConfig[escrow.status];
                  return (
                    <div key={escrow.id} className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5 transition-colors hover:border-[#3a3a36]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-cream">{escrow.title}</h3>
                          <p className="mt-1 font-mono text-xs text-muted">{escrow.freelancer.slice(0, 6)}...{escrow.freelancer.slice(-4)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-[3px] border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${color}`}>
                          <Icon className="h-3 w-3" />
                          {label}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-4 text-xs sm:grid-cols-4">
                        <div><p className="text-muted">Amount</p><p className="mt-1 font-semibold text-cream">{escrow.amount} {escrow.token}</p></div>
                        <div><p className="text-muted">Milestone</p><p className="mt-1 font-semibold text-cream">{escrow.milestone}</p></div>
                        <div><p className="text-muted">Created</p><p className="mt-1 font-semibold text-cream">{escrow.createdAt}</p></div>
                        <div><p className="text-muted">Dispute window</p><p className="mt-1 font-semibold text-cream">{escrow.disputeWindow}</p></div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/escrow/${escrow.id}`} className="rounded-[4px] border border-[#2a2a26] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:border-[#3a3a36] hover:text-cream">
                          View
                        </Link>
                        {escrow.status === "active" && (
                          <>
                            <button type="button" className="rounded-[4px] border border-[#BBEBE1]/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#BBEBE1] transition-colors hover:bg-[#BBEBE1]/10">
                              Mark Complete
                            </button>
                            <button type="button" className="rounded-[4px] border border-red-400/30 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-red-400 transition-colors hover:bg-red-400/10">
                              Open Dispute
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#2a2a26] pb-4">
              <h2 className="text-lg font-black tracking-tight text-cream">New Escrow Contract</h2>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-[3px] border border-[#2a2a26] p-1.5 text-muted transition-colors hover:text-cream">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Contract title</span>
                <input type="text" placeholder="e.g. Website redesign milestone 1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Freelancer wallet address</span>
                <input type="text" placeholder="0x..." value={form.freelancerAddress} onChange={(e) => setForm({ ...form, freelancerAddress: e.target.value })} className={`${inputCls} font-mono`} />
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
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Milestone description</span>
                <textarea placeholder="e.g. Complete homepage design and deliver Figma files" value={form.milestone} onChange={(e) => setForm({ ...form, milestone: e.target.value })} rows={2} className={`${inputCls} resize-none`} />
              </label>

              <div>
                <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Delivery method</span>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "github", icon: GitBranch,  label: "GitHub PR", desc: "Auto-release on merge" },
                    { key: "drive",  icon: FolderOpen,  label: "Google Drive", desc: "Auto-release on upload" },
                    { key: "manual", icon: CheckSquare, label: "Manual", desc: "Freelancer marks done" },
                  ] as const).map(({ key, icon: Icon, label, desc }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryMethod: key })}
                      className={`flex flex-col items-start gap-1 rounded-[4px] border p-3 text-left transition-colors ${
                        form.deliveryMethod === key
                          ? "border-[#BBEBE1]/40 bg-[#BBEBE1]/5 text-[#BBEBE1]"
                          : "border-[#2a2a26] text-muted hover:border-[#3a3a36]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[11px] font-semibold leading-tight">{label}</span>
                      <span className={`text-[10px] leading-tight ${form.deliveryMethod === key ? "text-[#BBEBE1]/70" : "text-muted"}`}>{desc}</span>
                    </button>
                  ))}
                </div>

                {form.deliveryMethod === "github" && (
                  <div className="mt-3">
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">GitHub repository URL</span>
                      <input type="text" placeholder="https://github.com/username/repo" value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} className={inputCls} />
                    </label>
                    <p className="mt-1.5 text-[10px] text-muted">On Rialo testnet, the contract will watch this repo for merged PRs</p>
                  </div>
                )}

                {form.deliveryMethod === "drive" && (
                  <div className="mt-3">
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Google Drive folder URL</span>
                      <input type="text" placeholder="https://drive.google.com/drive/folders/..." value={form.driveFolderUrl} onChange={(e) => setForm({ ...form, driveFolderUrl: e.target.value })} className={inputCls} />
                    </label>
                    <p className="mt-1.5 text-[10px] text-muted">On Rialo testnet, the contract will detect new file uploads to this folder</p>
                  </div>
                )}

                {form.deliveryMethod === "manual" && (
                  <p className="mt-3 text-[10px] text-muted">The freelancer will mark the milestone complete manually. The 48-hour dispute window starts immediately after.</p>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#1c1c1a] pt-3 pb-1 mt-3 flex gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="flex-1 rounded-[4px] border border-[#2a2a26] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-cream">
                Cancel
              </button>
              <button type="button" onClick={handleCreate} disabled={creating || !form.title || !form.freelancerAddress || !form.amount || !form.milestone} className="flex-1 rounded-[4px] bg-[#BBEBE1] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
                {creating ? "Creating..." : "Create Escrow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
