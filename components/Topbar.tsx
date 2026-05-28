"use client";

import Link from "next/link";
import { LogOut, Wallet } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

function shortenAddress(value?: string) {
  if (!value) {
    return "Wallet pending";
  }

  if (!value.startsWith("0x")) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export default function Topbar() {
  const { user, logout } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const fallback = user?.email?.address;

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a2a26] bg-bg/85 backdrop-blur-xl">
      <div className="flex h-18 items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="text-2xl font-bold tracking-wide text-cream">
          ONYX
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[#2a2a26] bg-surface px-4 py-2 text-sm text-muted sm:flex">
            <Wallet className="h-4 w-4 text-mint" />
            <span className="font-mono">{shortenAddress(walletAddress || fallback)}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-[#2a2a26] px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-mint hover:text-cream"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
