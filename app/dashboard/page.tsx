"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Send & Receive", href: "/send" },
  { label: "divider-1", href: "#", divider: true },
  { label: "Escrow", href: "/escrow" },
  { label: "AutoPay", href: "/autopay" },
  { label: "Split", href: "/split" },
  { label: "Payroll", href: "/payroll" },
  { label: "divider-2", href: "#", divider: true },
  { label: "Activity", href: "/activity" },
  { label: "Settings", href: "/settings" },
];

const summaryCards = [
  { label: "Total Locked", value: "$0.00", sub: "across all contracts" },
  { label: "Total Sent", value: "$0.00", sub: "this month" },
  { label: "Active Contracts", value: "0", sub: "contracts running" },
];

const contractTypes = ["Escrow", "AutoPay", "Split", "Payroll"];

export default function Dashboard() {
  const { authenticated, ready, user, logout } = usePrivy();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-bg text-cream">
      <div className="flex items-center justify-between border-b border-[#2a2a26] px-4 py-4 sm:px-6">
        <span className="text-xl font-bold tracking-tight">ONYX</span>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:block sm:font-mono">
            {user?.wallet?.address
              ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
              : user?.email?.address}
          </span>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-muted transition-colors hover:text-cream"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-65px)] flex-col md:flex-row">
        <div className="flex gap-1 overflow-x-auto border-b border-[#2a2a26] p-4 md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
          {navItems.map((item) =>
            item.divider ? (
              <div
                key={item.label}
                className="hidden select-none py-1 text-xs text-[#2a2a26] md:block"
              >
                ────────────
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  item.active
                    ? "bg-surface-2 font-medium text-cream"
                    : "text-muted hover:bg-surface hover:text-cream"
                }`}
              >
                {item.label}
              </a>
            )
          )}
        </div>

        <div className="flex-1 overflow-auto p-5 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-cream">Dashboard</h1>
          <p className="mb-8 text-muted">
            Welcome to ONYX. Your contracts will appear here.
          </p>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-[#2a2a26] bg-surface p-5"
              >
                <p className="mb-1 text-sm text-muted">{card.label}</p>
                <p className="mb-1 text-2xl font-bold text-cream">{card.value}</p>
                <p className="text-xs text-muted">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#2a2a26] bg-surface p-6 text-center sm:p-12">
            <p className="mb-2 font-medium text-cream">No contracts yet</p>
            <p className="mb-6 text-sm text-muted">
              Create your first contract to get started
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {contractTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className="rounded-lg border border-[#2a2a26] px-4 py-2 text-sm text-muted transition-colors hover:border-mint hover:text-cream"
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
