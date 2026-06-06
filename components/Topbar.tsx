"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";

const PAGE_NAMES: Record<string, string> = {
  dashboard: "Dashboard",
  send:      "Send & Receive",
  escrow:    "Escrow",
  autopay:   "AutoPay",
  split:     "Split",
  payroll:   "Payroll",
  swap:      "Swap & Bridge",
  activity:  "Activity",
  settings:  "Settings",
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
    <header className="sticky top-0 z-40 border-b border-[#2a2a26] bg-[#141414]">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b6760] transition-colors hover:text-[#E8E3D5]"
          >
            ONYX
          </Link>
          <span className="text-[#3a3a36]">/</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E8E3D5]">
            {pageName}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Wallet pill */}
          <div className="hidden items-center gap-2 rounded-[3px] border border-[#2a2a26] bg-[#1c1c1a] px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#BBEBE1] opacity-60" />
            <span className="font-mono text-[11px] text-[#6b6760]">
              {shortenAddress(walletAddress || fallback)}
            </span>
          </div>
          {/* Sign out */}
          <button
            type="button"
            onClick={logout}
            className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6b6760] transition-colors hover:text-[#E8E3D5]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
