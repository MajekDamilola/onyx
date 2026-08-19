"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  CheckSquare,
  Clock,
  Copy,
  ExternalLink,
  FolderOpen,
  GitBranch,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

type EscrowStatus = "active" | "disputed" | "completed" | "released";

interface EscrowRecord {
  id: string;
  title: string;
  clientWallet: string;
  freelancerWallet: string;
  amount: string;
  token: string;
  milestone: string;
  status: EscrowStatus;
  deliveryMethod: "github" | "drive" | "manual";
  repoUrl: string;
  driveFolderUrl: string;
  createdAt: string;
  disputeWindowEnds: string | null;
  completedAt: string | null;
}

const DISPUTE_WINDOW_MS = 48 * 60 * 60 * 1000;

const statusConfig = {
  active:    { label: "Active",    icon: Clock,        color: "text-[#BCEDE2] border-[#BCEDE2]/30 bg-[#BCEDE2]/10" },
  disputed:  { label: "Disputed",  icon: AlertCircle,  color: "text-red-400 border-red-400/30 bg-red-400/10" },
  completed: { label: "Completed", icon: CheckCircle,  color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
  released:  { label: "Released",  icon: CheckCircle,  color: "text-green-400 border-green-400/30 bg-green-400/10" },
};

const deliveryLabels = {
  github: "GitHub PR merge",
  drive:  "Google Drive",
  manual: "Manual",
};

const deliveryIcons = {
  github: GitBranch,
  drive:  FolderOpen,
  manual: CheckSquare,
};

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EscrowDetailPage() {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [copied, setCopied] = useState(false);
  const [escrow, setEscrow] = useState<EscrowRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  const walletAddress = useMemo(
    () => wallets?.[0]?.address?.toLowerCase() ?? "",
    [wallets]
  );

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(`escrow_record_${id}`);
      setEscrow(raw ? (JSON.parse(raw) as EscrowRecord) : null);
    } catch {
      setEscrow(null);
    }
    setLoaded(true);
  }, [id]);

  const persist = (updated: EscrowRecord) => {
    setEscrow(updated);
    localStorage.setItem(`escrow_record_${updated.id}`, JSON.stringify(updated));
    if (walletAddress && (updated.clientWallet ?? "").toLowerCase() === walletAddress) {
      try {
        const list = JSON.parse(localStorage.getItem(`escrows_${updated.clientWallet}`) || "[]") as EscrowRecord[];
        const merged = list.map((e) => (e.id === updated.id ? updated : e));
        localStorage.setItem(`escrows_${updated.clientWallet}`, JSON.stringify(merged));
      } catch {
        // ignore malformed list, the record itself is still persisted
      }
    }
  };

  const handleReleaseEarly = () => {
    if (!escrow) return;
    persist({ ...escrow, status: "released", completedAt: new Date().toISOString() });
  };

  const handleOpenDispute = () => {
    if (!escrow) return;
    persist({ ...escrow, status: "disputed" });
  };

  const handleMarkComplete = () => {
    if (!escrow) return;
    const now = new Date();
    persist({
      ...escrow,
      status: "completed",
      completedAt: now.toISOString(),
      disputeWindowEnds: new Date(now.getTime() + DISPUTE_WINDOW_MS).toISOString(),
    });
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ready || !authenticated || !loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0A]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="min-h-screen bg-[#090A0A] text-cream">
        <Topbar />
        <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
          <Sidebar activePage="escrow" />
          <main className="flex-1 overflow-hidden p-5 sm:p-8">
            <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-16 text-center">
              <Shield className="mx-auto mb-4 h-8 w-8 text-[#9A9E9B]" />
              <p className="mb-2 text-base font-bold text-cream">Escrow not found</p>
              <p className="mx-auto mb-6 max-w-lg text-xs leading-5 text-muted">
                This escrow doesn&apos;t exist in this browser&apos;s local storage. It may have been created on a different device.
              </p>
              <Link
                href="/escrow"
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#BCEDE2] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white"
              >
                Back to Escrow
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const { label: statusLabel, icon: StatusIcon, color: statusColor } = statusConfig[escrow.status] ?? statusConfig.active;
  const DeliveryIcon = deliveryIcons[escrow.deliveryMethod] ?? deliveryIcons.manual;

  const role =
    walletAddress && walletAddress === (escrow.clientWallet ?? "").toLowerCase()
      ? "client"
      : walletAddress && walletAddress === (escrow.freelancerWallet ?? "").toLowerCase()
      ? "freelancer"
      : "readonly";

  return (
    <div className="min-h-screen bg-[#090A0A] text-cream">
      <Topbar />
      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="escrow" />
        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            <Link
              href="/escrow"
              className="mb-6 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-cream"
            >
              ← Back to Escrow
            </Link>

            <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_340px]">
              {/* Left column */}
              <div className="space-y-4">
                {/* Header card */}
                <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-black tracking-tight text-cream">{escrow.title}</h1>
                      <p className="mt-1 text-[10px] text-muted">
                        Created {escrow.createdAt} · ID: {escrow.id}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${statusColor}`}>
                      <StatusIcon className="h-2.5 w-2.5" />
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
                    <div>
                      <p className="text-muted">Amount locked</p>
                      <p className="mt-1 text-lg font-black tracking-tight text-cream">
                        {escrow.amount} {escrow.token}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Delivery method</p>
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-[6px] border border-[#252929] bg-[#131515] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-cream">
                        <DeliveryIcon className="h-3 w-3 text-[#BCEDE2]" />
                        {deliveryLabels[escrow.deliveryMethod]}
                      </span>
                    </div>
                    <div>
                      <p className="text-muted">
                        {role === "freelancer" ? "Client" : "Freelancer"}
                      </p>
                      <p className="mt-1 font-mono text-cream">
                        {shortenAddress(
                          role === "freelancer"
                            ? escrow.clientWallet
                            : escrow.freelancerWallet
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Dispute window</p>
                      <p className="mt-1 font-semibold text-cream">
                        {escrow.disputeWindowEnds
                          ? `Ends ${formatDateTime(escrow.disputeWindowEnds)}`
                          : "48 hours after delivery"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Milestone */}
                <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Milestone</p>
                  <p className="mt-3 text-sm leading-5 text-cream">{escrow.milestone}</p>
                </div>

                {/* Repo URL */}
                {escrow.deliveryMethod === "github" && escrow.repoUrl && (
                  <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">GitHub Repository</p>
                    <a
                      href={escrow.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs text-[#BCEDE2] transition-colors hover:text-cream"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {escrow.repoUrl}
                    </a>
                  </div>
                )}

                {escrow.deliveryMethod === "drive" && escrow.driveFolderUrl && (
                  <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Google Drive Folder</p>
                    <a
                      href={escrow.driveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs text-[#BCEDE2] transition-colors hover:text-cream"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {escrow.driveFolderUrl}
                    </a>
                  </div>
                )}

                {/* Coming on Rialo testnet */}
                <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Coming on Rialo testnet</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-[8px] border border-[#252929] bg-[#131515] p-3 opacity-60">
                      <GitBranch className="h-4 w-4 text-[#BCEDE2]" />
                      <p className="mt-2 text-xs font-semibold text-cream">GitHub PR merge auto-detection</p>
                      <p className="mt-1 text-[10px] text-muted">Contract calls GitHub API directly to confirm PR merge</p>
                    </div>
                    <div className="rounded-[8px] border border-[#252929] bg-[#131515] p-3 opacity-60">
                      <FolderOpen className="h-4 w-4 text-[#BCEDE2]" />
                      <p className="mt-2 text-xs font-semibold text-cream">Google Drive delivery detection</p>
                      <p className="mt-1 text-[10px] text-muted">Contract detects new file uploads automatically</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column — actions */}
              <div className="space-y-3">
                {/* Viewing as */}
                <div className="rounded-[8px] border border-[#252929] bg-[#0E1010] px-4 py-3 text-center">
                  <p className="text-[10px] text-muted">
                    Viewing as:{" "}
                    <span className="font-semibold uppercase tracking-[0.1em] text-cream">
                      {role === "readonly" ? "Observer" : role}
                    </span>
                  </p>
                </div>

                {/* Read-only */}
                {role === "readonly" && (
                  <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5 text-center">
                    <Shield className="mx-auto mb-3 h-6 w-6 text-muted" />
                    <p className="text-sm font-semibold text-cream">Observer view</p>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      Connect the client or freelancer wallet to take actions on this escrow.
                    </p>
                  </div>
                )}

                {/* Client view */}
                {role === "client" && (
                  <div className="space-y-2.5">
                    <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                      <p className="text-xs font-semibold text-cream">Share with freelancer</p>
                      <p className="mt-1.5 text-[11px] leading-5 text-muted">
                        Share this link so your freelancer can mark the milestone complete.
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-[#252929] py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:border-[#313737] hover:text-cream"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copied ? "Copied!" : "Copy escrow link"}
                      </button>
                    </div>

                    {escrow.status === "active" && (
                      <>
                        <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                          <p className="text-xs font-semibold text-cream">Release early</p>
                          <p className="mt-1.5 text-[11px] leading-5 text-muted">
                            Only release early if you are fully satisfied with the delivered work.
                          </p>
                          <button
                            type="button"
                            onClick={handleReleaseEarly}
                            className="mt-3 w-full rounded-[8px] border border-[#BCEDE2]/40 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#BCEDE2] transition-colors hover:bg-[#BCEDE2]/10"
                          >
                            Release Early
                          </button>
                        </div>

                        {escrow.deliveryMethod === "manual" && (
                          <button
                            type="button"
                            onClick={handleOpenDispute}
                            className="w-full rounded-[8px] border border-red-400/30 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-red-400 transition-colors hover:bg-red-400/10"
                          >
                            Open Dispute
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Freelancer view */}
                {role === "freelancer" && (
                  <div className="space-y-2.5">
                    {escrow.status === "active" && escrow.deliveryMethod === "manual" && (
                      <div className="rounded-[12px] border border-[#BCEDE2]/20 bg-[#0E1010] p-4 text-center">
                        <p className="text-xs font-semibold text-cream">Ready to deliver?</p>
                        <p className="mt-2 text-[11px] leading-5 text-muted">
                          Click when you have delivered the work. The client will have 48 hours to raise a dispute.
                        </p>
                        <button
                          type="button"
                          onClick={handleMarkComplete}
                          className="mt-3 w-full rounded-[8px] bg-[#BCEDE2] py-2 text-xs font-medium uppercase tracking-[0.1em] text-[#090A0A] transition-colors hover:bg-white"
                        >
                          Mark as Complete
                        </button>
                      </div>
                    )}

                    {escrow.status === "active" && escrow.deliveryMethod === "github" && (
                      <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                        <div className="flex items-center gap-2 text-[#BCEDE2]">
                          <GitBranch className="h-4 w-4" />
                          <p className="text-xs font-semibold">GitHub auto-release</p>
                        </div>
                        <p className="mt-2 text-[11px] leading-5 text-muted">
                          Payment will release automatically when your PR is merged. Make sure you submitted a PR to the linked repo.
                        </p>
                        {escrow.repoUrl && (
                          <a
                            href={escrow.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-[#BCEDE2] transition-colors hover:text-cream"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {escrow.repoUrl}
                          </a>
                        )}
                      </div>
                    )}

                    {escrow.status === "active" && escrow.deliveryMethod === "drive" && (
                      <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                        <div className="flex items-center gap-2 text-[#BCEDE2]">
                          <FolderOpen className="h-4 w-4" />
                          <p className="text-xs font-semibold">Drive auto-release</p>
                        </div>
                        <p className="mt-2 text-[11px] leading-5 text-muted">
                          Payment will release automatically when files are detected in the linked folder.
                        </p>
                        {escrow.driveFolderUrl && (
                          <a
                            href={escrow.driveFolderUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-[#BCEDE2] transition-colors hover:text-cream"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {escrow.driveFolderUrl}
                          </a>
                        )}
                      </div>
                    )}

                    {escrow.status === "completed" && (
                      <div className="rounded-[12px] border border-amber-400/30 bg-amber-400/5 p-4 text-center">
                        <p className="text-xs font-semibold text-amber-400">Awaiting release</p>
                        <p className="mt-2 text-[11px] leading-5 text-muted">
                          Dispute window ends{" "}
                          {escrow.disputeWindowEnds ? formatDateTime(escrow.disputeWindowEnds) : "48 hours after completion"}.
                        </p>
                      </div>
                    )}

                    {escrow.status === "released" && (
                      <div className="rounded-[12px] border border-green-400/30 bg-green-400/5 p-4 text-center">
                        <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-400" />
                        <p className="text-xs font-semibold text-green-400">Payment sent</p>
                        <p className="mt-1 text-[11px] text-muted">Payment has been sent to your wallet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
