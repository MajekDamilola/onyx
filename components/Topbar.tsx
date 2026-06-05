"use client";

import Link from "next/link";
import { LogOut, Wallet } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";

const PAGE_NAMES: Record<string, string> = {
  dashboard: "Dashboard",
  send: "Send & Receive",
  escrow: "Escrow",
  autopay: "AutoPay",
  split: "Split",
  payroll: "Payroll",
  swap: "Swap & Bridge",
  activity: "Activity",
  settings: "Settings",
};

function shortenAddress(value?: string) {
  if (!value) return "Wallet pending";
  if (!value.startsWith("0x")) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export default function Topbar() {
  const { user, logout } = usePrivy();
  const pathname = usePathname();
  const walletAddress = user?.wallet?.address;
  const fallback = user?.email?.address;

  const segment = pathname?.split("/")[1] ?? "";
  const pageName = PAGE_NAMES[segment] ?? "ONYX";

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a2a26]/60 bg-gradient-to-r from-bg to-bg backdrop-blur-xl">
      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight text-cream">
            ONYX
          </Link>
          <span className="hidden text-[#3a3a36] md:block">/</span>
          <span className="hidden text-sm text-muted md:block">{pageName}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[#2a2a26] bg-surface-2 px-4 py-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <Wallet className="h-3.5 w-3.5 text-mint" />
            <span className="font-mono text-sm text-muted">{shortenAddress(walletAddress || fallback)}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-cream"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
