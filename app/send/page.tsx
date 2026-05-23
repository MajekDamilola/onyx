"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { QRCodeSVG } from "qrcode.react";
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  parseUnits,
  http,
} from "viem";
import { sepolia } from "viem/chains";

const navItems = [
  { label: "Dashboard", href: "/dashboard", active: false },
  { label: "Send & Receive", href: "/send", active: true },
  { label: "divider-1", href: "#", divider: true },
  { label: "Escrow", href: "/escrow" },
  { label: "AutoPay", href: "/autopay" },
  { label: "Split", href: "/split" },
  { label: "Payroll", href: "/payroll" },
  { label: "divider-2", href: "#", divider: true },
  { label: "Activity", href: "/activity" },
  { label: "Settings", href: "/settings" },
];

const tokenContracts: Record<string, `0x${string}`> = {
  USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  USDT: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
};

const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
];

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

function formatToken(balance: bigint) {
  return formatUnits(balance, 6);
}

export default function SendPage() {
  const router = useRouter();
  const { authenticated, ready, user, sendTransaction, logout } = usePrivy();
  const { wallets } = useWallets();
  const walletAddress = useMemo(
    () => wallets?.[0]?.address || user?.wallet?.address || "",
    [wallets, user]
  );

  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState<"USDC" | "USDT">("USDC");
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState({ USDC: "0.00", USDT: "0.00" });
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [authenticated, ready, router]);

  useEffect(() => {
    if (!walletAddress || !ready || !authenticated) {
      return;
    }

    const loadBalances = async () => {
      setLoadingBalances(true);
      try {
        const [usdcBalance, usdtBalance] = await Promise.all([
          publicClient.readContract({
            address: tokenContracts.USDC,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [walletAddress],
          }),
          publicClient.readContract({
            address: tokenContracts.USDT,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [walletAddress],
          }),
        ]);

        setBalances({
          USDC: formatToken(usdcBalance as bigint),
          USDT: formatToken(usdtBalance as bigint),
        });
      } catch (err) {
        setBalances({ USDC: "0.00", USDT: "0.00" });
      } finally {
        setLoadingBalances(false);
      }
    };

    loadBalances();
  }, [walletAddress, ready, authenticated]);

  const handleSend = async () => {
    setError("");
    setTxHash("");
    setInfoVisible(true);

    const trimmedRecipient = recipient.trim();
    if (!trimmedRecipient) {
      setError("Recipient address is required.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    if (!walletAddress) {
      setError("Wallet address not available.");
      return;
    }

    setStatus("pending");

    try {
      const value = parseUnits(amount, 6);
      const data = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [trimmedRecipient, value],
      });

      const receipt = await sendTransaction({
        to: tokenContracts[token],
        data,
        value: BigInt(0),
        chainId: sepolia.id,
      });

      setTxHash(receipt.transactionHash);
      setStatus("success");
      setTimeout(() => {
        setInfoVisible(false);
      }, 7500);
    } catch (sendError) {
      setError(
        sendError instanceof Error ? sendError.message : "Transaction failed."
      );
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    if (!walletAddress) {
      return;
    }
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

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
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
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
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cream">Send & Receive</h1>
              <p className="mt-2 max-w-2xl text-muted">
                Transfer USDC and USDT on Sepolia, or share your address to receive funds.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("send")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === "send"
                    ? "bg-surface-2 text-cream"
                    : "border border-[#2a2a26] text-muted hover:border-mint hover:text-mint"
                }`}
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("receive")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === "receive"
                    ? "bg-surface-2 text-cream"
                    : "border border-[#2a2a26] text-muted hover:border-mint hover:text-mint"
                }`}
              >
                Receive
              </button>
            </div>
          </div>

          {activeTab === "send" ? (
            <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6 shadow-sm sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-3">
                  <span className="text-sm font-semibold text-cream">Recipient wallet</span>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    placeholder="0x..."
                    className="block w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  />
                </label>

                <label className="space-y-3">
                  <span className="text-sm font-semibold text-cream">Token</span>
                  <select
                    value={token}
                    onChange={(event) => setToken(event.target.value as "USDC" | "USDT")}
                    className="block w-full cursor-pointer rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  >
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                  </select>
                </label>

                <label className="space-y-3 md:col-span-2">
                  <span className="text-sm font-semibold text-cream">Amount</span>
                  <input
                    type="number"
                    min="0"
                    step="0.000001"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="0.00"
                    className="block w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition focus:border-mint"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-[#2a2a26] bg-[#141414]/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-mint">Sepolia balances</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#2a2a26] bg-bg p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted">USDC</p>
                      <p className="mt-2 text-xl font-bold text-cream">{loadingBalances ? "Loading..." : balances.USDC}</p>
                    </div>
                    <div className="rounded-2xl border border-[#2a2a26] bg-bg p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted">USDT</p>
                      <p className="mt-2 text-xl font-bold text-cream">{loadingBalances ? "Loading..." : balances.USDT}</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={status === "pending"}
                  className="inline-flex items-center justify-center rounded-full bg-mint px-6 py-3.5 text-base font-bold text-bg transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "pending" ? "Sending..." : "Send"}
                </button>
              </div>

              {infoVisible && (
                <div className="mt-6 rounded-3xl border border-mint/30 bg-mint/10 p-5 text-sm text-mint">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-8 w-8 rounded-full bg-mint/15 text-mint flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                        <path d="M9.5 10.5a2.5 2.5 0 0 1 5 0" />
                      </svg>
                    </div>
                    <p>
                      On Rialo mainnet, this transaction will be automatically screened for compliance via Rialo IPC (Identity, Privacy & Compliance) — blocking sanctioned addresses at the protocol level before execution.
                    </p>
                  </div>
                </div>
              )}

              {status === "success" && txHash && (
                <div className="mt-6 rounded-3xl border border-mint/30 bg-surface-2 p-5 text-sm text-cream">
                  <p className="font-semibold">Success!</p>
                  <p className="mt-2 text-muted">Transaction completed.</p>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-mint transition hover:text-cream"
                  >
                    View on Sepolia Etherscan
                  </a>
                </div>
              )}

              {status === "error" && error && (
                <div className="mt-6 rounded-3xl border border-red-500/25 bg-[#3f1616] p-5 text-sm text-red-200">
                  <p className="font-semibold">Transaction failed</p>
                  <p className="mt-2">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6 shadow-sm sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="rounded-3xl border border-[#2a2a26] bg-bg p-5">
                  <p className="text-sm font-semibold text-cream">Your address</p>
                  <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-[#2a2a26] bg-surface-2 p-4">
                    <p className="break-all text-base font-medium text-cream">{walletAddress}</p>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex w-max items-center justify-center rounded-full border border-[#2a2a26] px-4 py-2 text-sm font-semibold text-mint transition hover:bg-mint/10"
                    >
                      {copied ? "Copied" : "Copy address"}
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-muted">
                    Share this address to receive USDC or USDT on Sepolia.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#2a2a26] bg-bg p-5 text-center">
                  <p className="text-sm font-semibold text-cream">QR code</p>
                  <div className="mx-auto my-6 h-[260px] w-[260px] rounded-3xl bg-surface p-4">
                    <QRCodeSVG
                      value={walletAddress || ""}
                      size={252}
                      bgColor="#141414"
                      fgColor="#BBEBE1"
                      title="Receive address QR code"
                    />
                  </div>
                  <p className="text-sm text-muted">
                    Share this address to receive USDC or USDT on Sepolia.
                  </p>
                  <p className="mt-4 text-xs text-muted">
                    On Rialo mainnet, incoming transactions are screened via Rialo IPC automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
