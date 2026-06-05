"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { QRCodeSVG } from "qrcode.react";
import { ChevronDown, Copy, Info, Send, Wallet } from "lucide-react";
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  parseUnits,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

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
  const { authenticated, ready, user, sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  const walletAddress = useMemo(
    () => wallets?.[0]?.address || user?.wallet?.address || "",
    [wallets, user]
  );

  const TOKEN_LOGOS: Record<string, string> = {
    USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  };

  const [activeTab, setActiveTab] = useState<"send" | "receive">("send");
  const [showTokenMenu, setShowTokenMenu] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState<"USDC" | "USDT">("USDC");
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState({ USDC: "0.00", USDT: "0.00" });
  const [loadingBalances, setLoadingBalances] = useState(false);
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
      <Topbar />

      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="send" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-10 top-8 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative">
            <div className="mb-8 pb-8 border-b border-[#2a2a26] flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-5xl font-bold text-cream tracking-tight">
                  Send & Receive
                </h1>
                <div className="w-12 h-1 bg-mint rounded-full mt-3 mb-4" />
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                  Transfer USDC and USDT on Sepolia, or share your wallet address to receive funds.
                </p>
              </div>
              <div className="flex w-full rounded-full border border-[#2a2a26] bg-surface p-1 sm:w-auto">
                {(["send", "receive"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold capitalize transition-colors sm:flex-none ${
                      activeTab === tab
                        ? "bg-mint text-bg"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "send" ? (
              <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36] sm:p-8">
                <div className="mb-6 flex items-start gap-3 rounded-3xl border border-mint/25 bg-mint/5 p-4 text-sm leading-6 text-mint">
                  <Info className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>
                    Sending on Sepolia testnet. On Rialo testnet, all transactions are screened via Rialo IPC before execution.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-3">
                    <span className="text-sm font-semibold text-cream">Recipient wallet</span>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(event) => setRecipient(event.target.value)}
                      placeholder="0x..."
                      className="block w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint"
                    />
                  </label>

                  <div className="space-y-3">
                    <span className="text-sm font-semibold text-cream">Token</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTokenMenu((prev) => !prev)}
                        className="flex w-full items-center gap-2 rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors hover:border-mint/50 focus:border-mint"
                      >
                        <img src={TOKEN_LOGOS[token]} alt={token} className="h-5 w-5 rounded-full" />
                        <span className="flex-1 text-left">{token}</span>
                        <ChevronDown className="h-4 w-4 text-muted" />
                      </button>
                      {showTokenMenu && (
                        <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-2xl border border-[#2a2a26] bg-surface shadow-lg">
                          {(["USDC", "USDT"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => { setToken(t); setShowTokenMenu(false); }}
                              className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-surface-2 ${token === t ? "text-mint" : "text-cream"}`}
                            >
                              <img src={TOKEN_LOGOS[t]} alt={t} className="h-5 w-5 rounded-full" />
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="space-y-3 md:col-span-2">
                    <span className="text-sm font-semibold text-cream">Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.000001"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      className="block w-full rounded-2xl border border-[#2a2a26] bg-bg px-4 py-3 text-cream outline-none transition-colors focus:border-mint"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-[#2a2a26] bg-bg/80 p-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-mint">Sepolia balances</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {(["USDC", "USDT"] as const).map((asset) => (
                        <div key={asset} className="rounded-2xl border border-[#2a2a26] bg-surface p-4">
                          <div className="flex items-center gap-2">
                            <img src={TOKEN_LOGOS[asset]} alt={asset} className="h-6 w-6 rounded-full" />
                            <p className="text-xs uppercase tracking-[0.24em] text-muted">{asset}</p>
                          </div>
                          <p className="mt-2 text-xl font-bold text-cream">
                            {loadingBalances ? "Loading..." : balances[asset]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={status === "pending"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-6 py-3.5 text-base font-bold text-bg transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {status === "pending" ? "Sending..." : "Send"}
                  </button>
                </div>

                {status === "success" && txHash && (
                  <div className="mt-6 rounded-3xl border border-mint/30 bg-surface-2 p-5 text-sm text-cream">
                    <p className="font-semibold">Success</p>
                    <p className="mt-2 text-muted">Transaction completed.</p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-mint transition-colors hover:text-cream"
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
              <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6 transition-colors hover:border-[#3a3a36] sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                  <div className="rounded-3xl border border-[#2a2a26] bg-bg p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                      <Wallet className="h-7 w-7" />
                    </div>
                    <p className="mt-6 text-sm font-semibold text-cream">Your address</p>
                    <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-[#2a2a26] bg-surface-2 p-4">
                      <p className="break-all text-base font-medium text-cream">{walletAddress}</p>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex w-max items-center gap-2 rounded-full border border-[#2a2a26] px-4 py-2 text-sm font-semibold text-mint transition-colors hover:border-mint hover:bg-mint/10"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? "Copied" : "Copy address"}
                      </button>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-muted">
                      Share this address to receive USDC or USDT. On Rialo testnet,
                      incoming transactions are automatically screened for compliance via Rialo IPC.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#2a2a26] bg-bg p-6 text-center">
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
                    <p className="text-sm leading-6 text-muted">
                      Scan to copy your wallet address.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
