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

const mockEscrow = {
  id: "demo123",
  title: "Website redesign milestone 1",
  clientWallet: "0x1234567890123456789012345678901234567890",
  freelancerWallet: "0x0987654321098765432109876543210987654321",
  amount: "500",
  token: "USDC",
  milestone: "Complete homepage design and deliver Figma files",
  status: "active" as "active" | "disputed" | "completed" | "released",
  deliveryMethod: "github" as "github" | "drive" | "manual",
  repoUrl: "https://github.com/client/project",
  driveFolderUrl: "",
  createdAt: "2026-01-01",
  disputeWindowEnds: null as string | null,
  completedAt: null as string | null,
};

const statusConfig = {
  active: { label: "Active", icon: Clock, color: "text-mint border-mint/30 bg-mint/10" },
  disputed: { label: "Disputed", icon: AlertCircle, color: "text-red-400 border-red-400/30 bg-red-400/10" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
  released: { label: "Released", icon: CheckCircle, color: "text-green-400 border-green-400/30 bg-green-400/10" },
};

const deliveryLabels = {
  github: "GitHub PR merge",
  drive: "Google Drive",
  manual: "Manual",
};

const deliveryIcons = {
  github: GitBranch,
  drive: FolderOpen,
  manual: CheckSquare,
};

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function EscrowDetailPage() {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const params = useParams();
  const [copied, setCopied] = useState(false);

  const walletAddress = useMemo(
    () => wallets?.[0]?.address?.toLowerCase() ?? "",
    [wallets]
  );

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

  const escrow = mockEscrow;
  const { label: statusLabel, icon: StatusIcon, color: statusColor } = statusConfig[escrow.status];
  const DeliveryIcon = deliveryIcons[escrow.deliveryMethod];

  const role =
    walletAddress === escrow.clientWallet.toLowerCase()
      ? "client"
      : walletAddress === escrow.freelancerWallet.toLowerCase()
      ? "freelancer"
      : "readonly";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  void params;

  return (
    <div className="min-h-screen bg-bg text-cream">
      <Topbar />
      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="escrow" />
        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-12 top-10 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            <Link
              href="/escrow"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-cream"
            >
              ← Back to Escrow
            </Link>

            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
              {/* Left column — details */}
              <div className="space-y-5">
                {/* Header */}
                <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-bold text-cream">{escrow.title}</h1>
                      <p className="mt-1 text-xs text-muted">
                        Created {escrow.createdAt} · ID: {escrow.id}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted">Amount locked</p>
                      <p className="mt-1 text-xl font-bold text-cream">
                        {escrow.amount} {escrow.token}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Delivery method</p>
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#2a2a26] bg-bg px-3 py-1 text-xs font-semibold text-cream">
                        <DeliveryIcon className="h-3.5 w-3.5 text-mint" />
                        {deliveryLabels[escrow.deliveryMethod]}
                      </span>
                    </div>
                    <div>
                      <p className="text-muted">
                        {role === "freelancer" ? "Client" : "Freelancer"}
                      </p>
                      <p className="mt-1 font-mono text-sm text-cream">
                        {shortenAddress(
                          role === "freelancer"
                            ? escrow.clientWallet
                            : escrow.freelancerWallet
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Dispute window</p>
                      <p className="mt-1 text-sm font-semibold text-cream">
                        {escrow.disputeWindowEnds
                          ? `Ends ${escrow.disputeWindowEnds}`
                          : "48 hours after delivery"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Milestone */}
                <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mint/70">
                    Milestone
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-cream">
                    {escrow.milestone}
                  </p>
                </div>

                {/* Repo / Drive URL */}
                {escrow.deliveryMethod === "github" && escrow.repoUrl && (
                  <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mint/70">
                      GitHub Repository
                    </p>
                    <a
                      href={escrow.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm text-mint transition-colors hover:text-cream"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {escrow.repoUrl}
                    </a>
                  </div>
                )}

                {escrow.deliveryMethod === "drive" && escrow.driveFolderUrl && (
                  <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mint/70">
                      Google Drive Folder
                    </p>
                    <a
                      href={escrow.driveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm text-mint transition-colors hover:text-cream"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {escrow.driveFolderUrl}
                    </a>
                  </div>
                )}

                {/* Coming on Rialo testnet */}
                <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mint/70">
                    Coming on Rialo testnet
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#2a2a26] bg-bg p-4 opacity-60">
                      <GitBranch className="h-5 w-5 text-mint" />
                      <p className="mt-3 text-sm font-semibold text-cream">
                        GitHub PR merge auto-detection
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Contract calls GitHub API directly to confirm PR merge
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#2a2a26] bg-bg p-4 opacity-60">
                      <FolderOpen className="h-5 w-5 text-mint" />
                      <p className="mt-3 text-sm font-semibold text-cream">
                        Google Drive delivery detection
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Contract detects new file uploads automatically
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column — actions */}
              <div className="space-y-4">
                {/* Viewing as */}
                <div className="rounded-2xl border border-[#2a2a26] bg-surface px-4 py-3 text-center">
                  <p className="text-xs text-muted">
                    Viewing as:{" "}
                    <span className="font-semibold capitalize text-cream">
                      {role === "readonly" ? "Observer" : role}
                    </span>
                  </p>
                </div>

                {/* Read-only */}
                {role === "readonly" && (
                  <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/10">
                      <Shield className="h-7 w-7 text-muted" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-cream">Observer view</p>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      Connect the client or freelancer wallet to take actions on this escrow.
                    </p>
                  </div>
                )}

                {/* Client view */}
                {role === "client" && (
                  <div className="space-y-3">
                    <div className="rounded-3xl border border-[#2a2a26] bg-surface p-5">
                      <p className="text-sm font-semibold text-cream">Share with freelancer</p>
                      <p className="mt-1.5 text-xs leading-5 text-muted">
                        Share this link so your freelancer can mark the milestone complete.
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2a2a26] py-2.5 text-sm font-semibold text-muted transition-colors hover:border-mint hover:text-cream"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? "Copied!" : "Copy escrow link"}
                      </button>
                    </div>

                    {escrow.status === "active" && (
                      <>
                        <div className="rounded-3xl border border-mint/20 bg-surface p-5">
                          <p className="text-sm font-semibold text-cream">Release early</p>
                          <p className="mt-1.5 text-xs leading-5 text-muted">
                            Only release early if you are fully satisfied with the delivered work.
                          </p>
                          <button
                            type="button"
                            className="mt-3 w-full rounded-full border border-mint py-2.5 text-sm font-semibold text-mint transition-colors hover:bg-mint hover:text-bg"
                          >
                            Release Early
                          </button>
                        </div>

                        {escrow.deliveryMethod === "manual" && (
                          <button
                            type="button"
                            className="w-full rounded-full border border-red-400/30 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-400/10"
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
                  <div className="space-y-3">
                    {escrow.status === "active" && escrow.deliveryMethod === "manual" && (
                      <div className="rounded-3xl border border-mint/30 bg-surface p-5 text-center">
                        <p className="text-sm font-semibold text-cream">Ready to deliver?</p>
                        <p className="mt-2 text-xs leading-5 text-muted">
                          Click when you have delivered the work. The client will have 48 hours to raise a dispute.
                        </p>
                        <button
                          type="button"
                          className="mt-4 w-full rounded-full bg-mint py-3 text-sm font-bold text-bg transition-colors hover:bg-cream"
                        >
                          Mark as Complete
                        </button>
                      </div>
                    )}

                    {escrow.status === "active" && escrow.deliveryMethod === "github" && (
                      <div className="rounded-3xl border border-[#2a2a26] bg-surface p-5">
                        <div className="flex items-center gap-2 text-mint">
                          <GitBranch className="h-5 w-5" />
                          <p className="text-sm font-semibold">GitHub auto-release</p>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted">
                          Payment will release automatically when your PR is merged. Make sure you submitted a PR to the linked repo.
                        </p>
                        {escrow.repoUrl && (
                          <a
                            href={escrow.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs text-mint transition-colors hover:text-cream"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {escrow.repoUrl}
                          </a>
                        )}
                      </div>
                    )}

                    {escrow.status === "active" && escrow.deliveryMethod === "drive" && (
                      <div className="rounded-3xl border border-[#2a2a26] bg-surface p-5">
                        <div className="flex items-center gap-2 text-mint">
                          <FolderOpen className="h-5 w-5" />
                          <p className="text-sm font-semibold">Drive auto-release</p>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted">
                          Payment will release automatically when files are detected in the linked folder.
                        </p>
                        {escrow.driveFolderUrl && (
                          <a
                            href={escrow.driveFolderUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs text-mint transition-colors hover:text-cream"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {escrow.driveFolderUrl}
                          </a>
                        )}
                      </div>
                    )}

                    {escrow.status === "completed" && (
                      <div className="rounded-3xl border border-amber-400/30 bg-amber-400/5 p-5 text-center">
                        <p className="text-sm font-semibold text-amber-400">Awaiting release</p>
                        <p className="mt-2 text-xs leading-5 text-muted">
                          Dispute window ends{" "}
                          {escrow.disputeWindowEnds
                            ? escrow.disputeWindowEnds
                            : "48 hours after completion"}
                          .
                        </p>
                      </div>
                    )}

                    {escrow.status === "released" && (
                      <div className="rounded-3xl border border-green-400/30 bg-green-400/5 p-5 text-center">
                        <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
                        <p className="mt-3 text-sm font-semibold text-green-400">Payment sent</p>
                        <p className="mt-1 text-xs text-muted">
                          Payment has been sent to your wallet.
                        </p>
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
