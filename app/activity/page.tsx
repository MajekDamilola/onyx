"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ExternalLink, RefreshCw } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface Transfer {
  hash: string;
  from: string;
  to: string;
  value: number;
  asset: string;
  metadata: { blockTimestamp: string };
  direction: "sent" | "received";
}

const ALCHEMY_URL =
  "https://eth-sepolia.g.alchemy.com/v2/NOXqRYkZ3ATw-AZViYHutp98zLOa-bbp";

async function fetchTransfers(
  address: string,
  direction: "sent" | "received"
): Promise<Transfer[]> {
  const params: Record<string, unknown> = {
    fromBlock: "0x0",
    toBlock: "latest",
    contractAddresses: [
      "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    ],
    category: ["erc20"],
    withMetadata: true,
    excludeZeroValue: true,
    maxCount: "0x32",
  };
  if (direction === "sent") params.fromAddress = address;
  else params.toAddress = address;

  const res = await fetch(ALCHEMY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [params],
    }),
  });
  const data = await res.json();
  return (data.result?.transfers || []).map(
    (t: Omit<Transfer, "direction">) => ({ ...t, direction })
  );
}

async function fetchActivity(address: string): Promise<Transfer[]> {
  const [sent, received] = await Promise.all([
    fetchTransfers(address, "sent"),
    fetchTransfers(address, "received"),
  ]);
  return [...sent, ...received].sort(
    (a, b) =>
      new Date(b.metadata.blockTimestamp).getTime() -
      new Date(a.metadata.blockTimestamp).getTime()
  );
}

function truncate(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ActivityPage() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const walletAddress = user?.wallet?.address || "";
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  useEffect(() => {
    if (!walletAddress) return;
    setLoading(true);
    fetchActivity(walletAddress)
      .then(setTransfers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [walletAddress]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const filtered =
    activeFilter === "Sent"
      ? transfers.filter((t) => t.direction === "sent")
      : activeFilter === "Received"
      ? transfers.filter((t) => t.direction === "received")
      : transfers;

  const totalSent = transfers
    .filter((t) => t.direction === "sent")
    .reduce((s, t) => s + (t.value || 0), 0);

  const totalReceived = transfers
    .filter((t) => t.direction === "received")
    .reduce((s, t) => s + (t.value || 0), 0);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                On-chain USDC and USDT transfer history for your connected wallet on Sepolia.
              </p>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Total sent</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">
                  {loading ? "—" : `$${fmt(totalSent)}`}
                </p>
              </div>
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Total received</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">
                  {loading ? "—" : `$${fmt(totalReceived)}`}
                </p>
              </div>
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Total transactions</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-cream">
                  {loading ? "—" : transfers.length}
                </p>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="mb-5 flex flex-wrap gap-1.5">
              {["All", "Sent", "Received"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-[3px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    activeFilter === filter
                      ? "bg-[#BBEBE1] text-[#141414]"
                      : "border border-[#2a2a26] text-muted hover:border-[#3a3a36] hover:text-cream"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Feed */}
            {loading ? (
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-12 text-center">
                <RefreshCw className="mx-auto mb-3 h-5 w-5 animate-spin text-[#6b6760]" />
                <p className="text-sm text-muted">Fetching transactions...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-12 text-center">
                <p className="text-sm font-semibold text-cream">No transactions yet</p>
                <p className="mt-1 text-xs text-muted">
                  USDC and USDT transfers on Sepolia will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((tx) => (
                  <div
                    key={`${tx.hash}-${tx.direction}`}
                    className="flex items-center gap-4 rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-4 transition-colors hover:border-[#3a3a36]"
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        tx.direction === "sent"
                          ? "border-blue-500/30 bg-blue-500/10"
                          : "border-[#BBEBE1]/30 bg-[#BBEBE1]/10"
                      }`}
                    >
                      {tx.direction === "sent" ? (
                        <ArrowUpRight className="h-4 w-4 text-blue-400" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-[#BBEBE1]" />
                      )}
                    </div>

                    {/* Center */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-cream">
                        {tx.direction === "sent" ? "Sent" : "Received"} {tx.asset}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted">
                        {tx.direction === "sent"
                          ? `To: ${truncate(tx.to)}`
                          : `From: ${truncate(tx.from)}`}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-bold ${
                          tx.direction === "received" ? "text-[#BBEBE1]" : "text-cream"
                        }`}
                      >
                        {tx.direction === "sent" ? "-" : "+"}
                        {fmt(tx.value || 0)}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {formatDate(tx.metadata.blockTimestamp)}
                      </p>
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
