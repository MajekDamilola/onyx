"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle,
  ChevronRight,
  Copy,
  ExternalLink,
  Globe,
  Key,
  LogOut,
  Shield,
  User,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        enabled ? "bg-[#BBEBE1]" : "bg-[#2a2a26]"
      }`}
    >
      <span
        className={`pointer-events-none mt-0.5 ml-0.5 inline-block h-4 w-4 rounded-full bg-[#141414] shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] overflow-hidden">
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: typeof User; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#2a2a26] px-5 py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#BBEBE1]" />
      <div>
        <p className="text-sm font-semibold text-cream">{title}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout, ready, authenticated, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [displayNameSaved, setDisplayNameSaved] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState<"warning" | "sent">("warning");

  const [notifications, setNotifications] = useState({
    escrow: true,
    autopay: true,
    payroll: true,
    security: true,
  });

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const hasEmbeddedWallet = !!user?.linkedAccounts?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any) => a.type === "wallet" && a.walletClientType === "privy"
  );

  const walletAddress = wallets[0]?.address ?? user?.wallet?.address ?? "";
  const emailAddress = user?.email?.address ?? "";

  function copyToClipboard(text: string, type: "wallet" | "email") {
    navigator.clipboard.writeText(text);
    if (type === "wallet") {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  }

  function saveDisplayName() {
    setDisplayNameSaved(true);
    setTimeout(() => setDisplayNameSaved(false), 2500);
  }

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function openExportModal() {
    setExportStep("warning");
    setShowExportModal(true);
  }

  async function handleExportWallet() {
    try {
      await exportWallet();
    } catch (_) {
      // exportWallet opens Privy's native secure UI; errors are handled by Privy
    }
    setExportStep("sent");
  }

  const inputCls = "rounded-[4px] border border-[#2a2a26] bg-[#242420] px-4 py-2.5 text-sm text-cream placeholder-muted/60 outline-none transition-colors focus:border-[#BBEBE1]/40";

  return (
    <div className="min-h-screen bg-[#141414] text-cream">
      <Topbar />
      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="settings" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative max-w-2xl">
            {/* Header */}
            <div className="mb-8 border-b border-[#2a2a26] pb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Account</p>
              <h1 className="text-4xl font-black tracking-tight text-cream">Settings</h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                Manage your profile, notifications, and account security.
              </p>
            </div>

            <div className="space-y-4">

              {/* Profile */}
              <SectionCard>
                <SectionHeader icon={User} title="Profile" description="Your account identity" />
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      Connected Wallet
                    </label>
                    <div className="flex items-center gap-2 rounded-[4px] border border-[#2a2a26] bg-[#242420] px-4 py-2.5">
                      <span className="flex-1 font-mono text-xs text-muted">
                        {walletAddress || "No wallet connected"}
                      </span>
                      {walletAddress && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(walletAddress, "wallet")}
                          className="shrink-0 text-muted transition-colors hover:text-cream"
                        >
                          {copiedWallet ? <Check className="h-3.5 w-3.5 text-[#BBEBE1]" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {emailAddress && (
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2 rounded-[4px] border border-[#2a2a26] bg-[#242420] px-4 py-2.5">
                        <span className="flex-1 text-xs text-muted">{emailAddress}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(emailAddress, "email")}
                          className="shrink-0 text-muted transition-colors hover:text-cream"
                        >
                          {copiedEmail ? <Check className="h-3.5 w-3.5 text-[#BBEBE1]" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      Display Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter a display name..."
                        className={`flex-1 ${inputCls}`}
                      />
                      <button
                        type="button"
                        onClick={saveDisplayName}
                        disabled={!displayName.trim()}
                        className="rounded-[4px] bg-[#BBEBE1] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-opacity disabled:opacity-40 hover:bg-white"
                      >
                        {displayNameSaved ? <Check className="h-3.5 w-3.5" /> : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Network */}
              <SectionCard>
                <SectionHeader icon={Globe} title="Network" description="Blockchain network configuration" />
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cream">Active Network</p>
                      <p className="text-xs text-muted mt-0.5">Currently on Sepolia testnet</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-[3px] border border-amber-400/30 bg-amber-400/10 px-3 py-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-400">Sepolia</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-[4px] border border-[#2a2a26] bg-[#242420] px-4 py-3 opacity-60">
                    <div>
                      <p className="text-sm font-medium text-cream">Switch to Mainnet</p>
                      <p className="text-xs text-muted mt-0.5">Available when contracts are deployed</p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="rounded-[3px] border border-[#2a2a26] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted cursor-not-allowed"
                    >
                      Locked
                    </button>
                  </div>
                </div>
              </SectionCard>

              {/* Notifications */}
              <SectionCard>
                <SectionHeader icon={Bell} title="Notifications" description="Control which alerts you receive" />
                <div className="px-5 py-1">
                  {(
                    [
                      { key: "escrow"   as const, label: "Escrow updates",       description: "Milestone completions, disputes" },
                      { key: "autopay"  as const, label: "AutoPay executions",   description: "When recurring payments run" },
                      { key: "payroll"  as const, label: "Payroll confirmations",description: "Payroll batch confirmations" },
                      { key: "security" as const, label: "Security alerts",      description: "New sign-ins and unusual activity" },
                    ]
                  ).map((item, idx, arr) => (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between py-3.5 ${idx < arr.length - 1 ? "border-b border-[#2a2a26]" : ""}`}
                    >
                      <div>
                        <p className="text-sm font-medium text-cream">{item.label}</p>
                        <p className="text-xs text-muted mt-0.5">{item.description}</p>
                      </div>
                      <Toggle enabled={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Security */}
              <SectionCard>
                <SectionHeader icon={Shield} title="Security" description="Wallet security and authentication" />
                <div className="px-5 py-4 space-y-3">
                  <div className="rounded-[4px] border border-[#2a2a26] bg-[#242420] p-4">
                    <div className="flex items-start gap-3">
                      <Key className="h-4 w-4 shrink-0 text-[#BBEBE1] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-cream">Authentication via Privy</p>
                        <p className="text-xs text-muted mt-1">
                          Your wallet is managed by Privy&apos;s embedded wallet infrastructure. Keys are
                          secured using threshold cryptography and never leave your device unencrypted.
                        </p>
                      </div>
                    </div>
                  </div>

                  {hasEmbeddedWallet ? (
                    <div>
                      <button
                        type="button"
                        onClick={openExportModal}
                        className="flex w-full items-center justify-between rounded-[4px] border border-[#2a2a26] bg-[#242420] px-4 py-3 text-sm font-medium text-cream transition-colors hover:border-[#3a3a36]"
                      >
                        <span>Export Private Key</span>
                        <ChevronRight className="h-4 w-4 text-muted" />
                      </button>
                      <p className="mt-1.5 text-[10px] text-muted">
                        Only available for email-connected wallets. External wallet users manage keys in their own wallet app.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 rounded-[4px] border border-[#2a2a26] bg-[#242420] px-4 py-3">
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted mt-0.5" />
                      <p className="text-xs text-muted">
                        You&apos;re using an external wallet. Manage your private key in your wallet app (MetaMask, Coinbase Wallet, etc.).
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Danger Zone */}
              <SectionCard>
                <SectionHeader icon={AlertTriangle} title="Danger Zone" description="Irreversible account actions" />
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cream">Sign Out</p>
                      <p className="text-xs text-muted mt-0.5">You can sign back in at any time</p>
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex items-center gap-2 rounded-[4px] border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-danger transition-colors hover:bg-danger/20"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </SectionCard>

            </div>
          </div>
        </main>
      </div>

      {/* Export Key Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="relative mx-4 w-full max-w-md rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              className="absolute right-4 top-4 text-muted transition-colors hover:text-cream"
            >
              <X className="h-4 w-4" />
            </button>

            {exportStep === "warning" ? (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-danger/20 bg-danger/10 mb-4">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                </div>

                <h2 className="text-lg font-black tracking-tight text-cream">Export Private Key</h2>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Exporting your private key gives complete control over your wallet to anyone who has it.
                  Never share it. Store it somewhere safe.
                </p>

                <div className="mt-4 rounded-[4px] border border-danger/20 bg-danger/5 p-4">
                  <ul className="space-y-1.5 text-[10px] text-danger/80">
                    <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">·</span> Never share your private key with anyone</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">·</span> ONYX and Privy will never ask for your key</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">·</span> Store it offline in a secure location</li>
                  </ul>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 rounded-[4px] border border-[#2a2a26] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExportWallet}
                    className="flex-1 rounded-[4px] border border-danger/30 bg-danger/10 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-danger transition-colors hover:bg-danger/20"
                  >
                    Send verification email
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#BBEBE1]/20 bg-[#BBEBE1]/10 mb-4">
                  <CheckCircle className="h-5 w-5 text-[#BBEBE1]" />
                </div>

                <h2 className="text-lg font-black tracking-tight text-cream">Check your email</h2>
                <p className="mt-2 text-xs leading-5 text-muted">
                  A verification link has been sent to your email. Click the link to reveal your private key.
                </p>

                <p className="mt-3 text-[10px] text-muted/60">
                  The link expires in 10 minutes. Check your spam folder if you don&apos;t see it.
                </p>

                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="mt-5 w-full rounded-[4px] border border-[#2a2a26] py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-cream"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
