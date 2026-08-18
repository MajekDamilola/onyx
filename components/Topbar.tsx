"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname } from "next/navigation";

const PAGE_NAMES: Record<string, string> = {
  dashboard: "Overview",
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
    <header className="sticky top-0 z-40 border-b border-[#252929] bg-[#090A0A]">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A9E9B] transition-colors hover:text-[#F4F4EF]"
          >
            ONYX
          </Link>
          <span className="text-[#313737]">/</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F4F4EF]">
            {pageName}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Network badge */}
          <div className="hidden items-center gap-1.5 rounded-[6px] border border-[#252929] bg-[#0E1010] px-2.5 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#73D6A5]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9A9E9B]">Sepolia</span>
          </div>
          {/* Wallet pill */}
          <div className="hidden items-center gap-2 rounded-[6px] border border-[#252929] bg-[#0E1010] px-3 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#BCEDE2] opacity-60" />
            <span className="font-mono text-[11px] text-[#9A9E9B]">
              {shortenAddress(walletAddress || fallback)}
            </span>
          </div>
          {/* Sign out */}
          <button
            type="button"
            onClick={logout}
            className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9E9B] transition-colors hover:text-[#F4F4EF]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
