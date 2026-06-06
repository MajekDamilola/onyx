"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { QRCodeSVG } from "qrcode.react";
import { ChevronDown, Copy, Info, Lock, Send, Shield, Wallet, Zap } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-cream">
      <Topbar />

      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="send" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative">
            {/* Header */}
            <div className="mb-8 border-b border-[#2a2a26] pb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b6760]">Transfers</p>
                <h1 className="text-4xl font-black tracking-tight text-cream">Send & Receive</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                  Send USDC or USDT to any wallet. On Rialo testnet, every transfer runs an automatic bidirectional compliance check via Rialo IPC before settlement — screening both sender and recipient against real-time sanctions databases. Amounts stay private via REX.
                </p>
              </div>
              {/* Tab switcher */}
              <div className="flex w-full rounded-[4px] border border-[#2a2a26] bg-[#1c1c1a] p-0.5 sm:w-auto">
                {(["send", "receive"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-[3px] px-5 py-2 text-xs font-medium uppercase tracking-[0.1em] transition-colors sm:flex-none ${
                      activeTab === tab
                        ? "bg-[#BBEBE1] text-[#141414]"
                        : "text-muted hover:text-cream"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Powered by Rialo strip */}
            <div className="mb-6 rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#BBEBE1]">Powered by Rialo</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Shield, title: "Compliance by default",  description: "Both wallets screened against sanctions databases before every transfer" },
                  { icon: Lock,   title: "Private amounts",        description: "Transfer amounts hidden on-chain via Rialo REX — only sender and recipient can see" },
                  { icon: Zap,    title: "No middleware",          description: "Compliance runs inside the smart contract itself — no oracles, no third parties" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex flex-col gap-2">
                      <Icon className="h-4 w-4 text-[#BBEBE1]" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-semibold text-cream">{item.title}</p>
                          <span className="rounded-[3px] border border-[#2a2a26] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted whitespace-nowrap">Coming on Rialo testnet</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-muted">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Send tab */}
            {activeTab === "send" ? (
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5 sm:p-6">
                <div className="mb-5 flex items-start gap-3 rounded-[4px] border border-[#BBEBE1]/20 bg-[#BBEBE1]/5 p-4 text-xs leading-5 text-[#BBEBE1]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    On Rialo testnet, this transfer will run a bidirectional compliance check via Rialo IPC before settlement. Both your wallet and the recipient&apos;s wallet are screened automatically. If either is flagged, the transaction is blocked before execution.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Recipient wallet</span>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(event) => setRecipient(event.target.value)}
                      placeholder="0x..."
                      className="block w-full rounded-[4px] border border-[#2a2a26] bg-[#141414] px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-[#BBEBE1]/40 placeholder:text-muted"
                    />
                  </label>

                  <div className="space-y-2">
                    <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Token</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTokenMenu((prev) => !prev)}
                        className="flex w-full items-center gap-2 rounded-[4px] border border-[#2a2a26] bg-[#141414] px-4 py-3 text-cream outline-none transition-colors hover:border-[#BBEBE1]/30"
                      >
                        <img src={TOKEN_LOGOS[token]} alt={token} className="h-4 w-4 rounded-full" />
                        <span className="flex-1 text-left text-sm">{token}</span>
                        <ChevronDown className="h-4 w-4 text-muted" />
                      </button>
                      {showTokenMenu && (
                        <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-[4px] border border-[#2a2a26] bg-[#1c1c1a] shadow-lg">
                          {(["USDC", "USDT"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => { setToken(t); setShowTokenMenu(false); }}
                              className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition-colors hover:bg-[#242420] ${token === t ? "text-[#BBEBE1]" : "text-cream"}`}
                            >
                              <img src={TOKEN_LOGOS[t]} alt={t} className="h-4 w-4 rounded-full" />
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="space-y-2 md:col-span-2">
                    <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.000001"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      className="block w-full rounded-[4px] border border-[#2a2a26] bg-[#141414] px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-[#BBEBE1]/40 placeholder:text-muted"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-col gap-4 rounded-[4px] border border-[#2a2a26] bg-[#242420] p-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#BBEBE1]">Sepolia balances</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {(["USDC", "USDT"] as const).map((asset) => (
                        <div key={asset} className="rounded-[4px] border border-[#2a2a26] bg-[#1c1c1a] p-3">
                          <div className="flex items-center gap-2">
                            <img src={TOKEN_LOGOS[asset]} alt={asset} className="h-4 w-4 rounded-full" />
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{asset}</p>
                          </div>
                          <p className="mt-2 text-lg font-black tracking-tight text-cream">
                            {loadingBalances ? "..." : balances[asset]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={status === "pending"}
                    className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#BBEBE1] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#141414] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {status === "pending" ? "Sending..." : "Send"}
                  </button>
                </div>

                {status === "success" && txHash && (
                  <div className="mt-5 rounded-[4px] border border-[#BBEBE1]/30 bg-[#242420] p-4 text-sm text-cream">
                    <p className="font-semibold">Success</p>
                    <p className="mt-1 text-xs text-muted">Transaction completed.</p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs text-[#BBEBE1] transition-colors hover:text-white"
                    >
                      View on Sepolia Etherscan →
                    </a>
                  </div>
                )}

                {status === "error" && error && (
                  <div className="mt-5 rounded-[4px] border border-red-500/25 bg-[#3f1616] p-4 text-xs text-red-200">
                    <p className="font-semibold">Transaction failed</p>
                    <p className="mt-1">{error}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Receive tab */
              <div className="rounded-[6px] border border-[#2a2a26] bg-[#1c1c1a] p-5 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                  <div className="rounded-[4px] border border-[#2a2a26] bg-[#242420] p-5">
                    <Wallet className="mb-4 h-4 w-4 text-[#BBEBE1]" />
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Your address</p>
                    <div className="mt-3 rounded-[4px] border border-[#2a2a26] bg-[#141414] p-3">
                      <p className="break-all text-sm font-medium text-cream">{walletAddress}</p>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-[3px] border border-[#2a2a26] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#BBEBE1] transition-colors hover:border-[#BBEBE1]/40"
                      >
                        <Copy className="h-3 w-3" />
                        {copied ? "Copied" : "Copy address"}
                      </button>
                    </div>
                    <p className="mt-4 text-xs leading-5 text-muted">
                      On Rialo testnet, every incoming transfer to your address is automatically screened for compliance via Rialo IPC. Private amounts via REX — senders can hide transfer amounts from public view.
                    </p>
                  </div>

                  <div className="rounded-[4px] border border-[#2a2a26] bg-[#242420] p-5 text-center">
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">QR code</p>
                    <div className="mx-auto my-5 h-[220px] w-[220px] rounded-[4px] bg-[#141414] p-3">
                      <QRCodeSVG
                        value={walletAddress || ""}
                        size={196}
                        bgColor="#141414"
                        fgColor="#BBEBE1"
                        title="Receive address QR code"
                      />
                    </div>
                    <p className="text-xs text-muted">Scan to copy your wallet address.</p>
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
