"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface OnyxActivity {
  hash: string;
  token: string;
  amount: string;
  recipient: string;
  timestamp: number;
}

function truncate(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtNum(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ActivityPage() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || "";
  const [activity, setActivity] = useState<OnyxActivity[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!walletAddress) return;
    try {
      const stored = localStorage.getItem(`onyx_activity_${walletAddress}`);
      setActivity(stored ? JSON.parse(stored) : []);
    } catch {
      setActivity([]);
    }
  }, [walletAddress]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const totalSent = activity.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

  // "received" filter shows nothing — ONYX only tracks outbound sends
  const filtered = activeFilter === "received" ? [] : activity;

  return (
    <div className="min-h-screen bg-[#141414] text-cream">
      <Topbar />
      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="activity" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#2a2a26] pb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">History</p>
              <h1 className="text-4xl font-black tracking-tight text-cream">Activity</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                USDC and USDT transfers sent through ONYX on Sepolia.
              </p>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Total sent</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">${fmtNum(totalSent)}</p>
              </div>
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Total received</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">$0.00</p>
              </div>
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Total transactions</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">{activity.length}</p>
              </div>
            </div>

            {/* Filter pills */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {["all", "sent", "received"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-[3px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    activeFilter === f
                      ? "bg-[#BBEBE1] text-[#141414]"
                      : "border border-[#2a2a26] text-muted hover:border-[#3a3a36] hover:text-cream"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Feed */}
            {filtered.length === 0 ? (
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-12 text-center">
                <p className="text-sm font-semibold text-cream">No transactions yet</p>
                <p className="mt-1 text-xs text-muted">
                  Transfers you send through ONYX will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((tx) => (
                  <div
                    key={tx.hash}
                    className="flex items-center gap-4 rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4 transition-colors hover:border-[#3a3a36]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
                      <ArrowUpRight className="h-4 w-4 text-blue-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-cream">Sent {tx.token}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted">To: {truncate(tx.recipient)}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-cream">
                        -{parseFloat(tx.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}{" "}
                        {tx.token}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted">{formatDate(tx.timestamp)}</p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-muted transition-colors hover:text-[#BBEBE1]"
                      >
                        Etherscan
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
