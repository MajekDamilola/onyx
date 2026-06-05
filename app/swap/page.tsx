"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpDown, ChevronDown, Info } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

type SwapToken = "USDC" | "USDT" | "RIALO";
type BridgeToken = "USDC" | "USDT";
type Chain = "Rialo" | "Ethereum" | "Solana" | "Base";

const TOKEN_LOGOS: Record<SwapToken, string | null> = {
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  RIALO: null,
};

const CHAIN_LOGOS: Record<Chain, string | null> = {
  Rialo: null,
  Ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  Solana: "https://cryptologos.cc/logos/solana-sol-logo.png",
  Base: "https://cryptologos.cc/logos/base-base-logo.png",
};

const SWAP_TOKENS: SwapToken[] = ["USDC", "USDT", "RIALO"];
const BRIDGE_TOKENS: BridgeToken[] = ["USDC", "USDT"];
const CHAINS: Chain[] = ["Rialo", "Ethereum", "Solana", "Base"];

function TokenLogo({ token, size = "md" }: { token: SwapToken; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-5 w-5" : "h-8 w-8";
  const logo = TOKEN_LOGOS[token];
  if (logo) {
    return <img src={logo} alt={token} className={`${dim} rounded-full`} />;
  }
  return (
    <div className={`${dim} rounded-full bg-mint/20 flex items-center justify-center flex-shrink-0`}>
      <span className={`font-bold text-mint ${size === "sm" ? "text-[10px]" : "text-xs"}`}>R</span>
    </div>
  );
}

function ChainLogo({ chain }: { chain: Chain }) {
  const logo = CHAIN_LOGOS[chain];
  if (logo) {
    return <img src={logo} alt={chain} className="h-7 w-7 rounded-full object-contain flex-shrink-0" />;
  }
  return (
    <div className="h-7 w-7 rounded-full bg-mint/20 flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] font-bold text-mint">R</span>
    </div>
  );
}

export default function SwapPage() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  // Swap state
  const [payToken, setPayToken] = useState<SwapToken>("USDC");
  const [receiveToken, setReceiveToken] = useState<SwapToken>("USDT");
  const [payAmount, setPayAmount] = useState("");
  const [showPayMenu, setShowPayMenu] = useState(false);
  const [showReceiveMenu, setShowReceiveMenu] = useState(false);

  // Bridge state
  const [fromChain, setFromChain] = useState<Chain>("Ethereum");
  const [toChain, setToChain] = useState<Chain>("Rialo");
  const [bridgeToken, setBridgeToken] = useState<BridgeToken>("USDC");
  const [bridgeAmount, setBridgeAmount] = useState("");
  const [receivingWallet, setReceivingWallet] = useState("");
  const [showFromChainMenu, setShowFromChainMenu] = useState(false);
  const [showToChainMenu, setShowToChainMenu] = useState(false);
  const [showBridgeTokenMenu, setShowBridgeTokenMenu] = useState(false);

  const [activeTab, setActiveTab] = useState<"swap" | "bridge">("swap");

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const sameChain = fromChain === toChain;

  const handleFlipTokens = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setPayAmount("");
  };

  const handleFlipChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  const closeAllMenus = () => {
    setShowPayMenu(false);
    setShowReceiveMenu(false);
    setShowFromChainMenu(false);
    setShowToChainMenu(false);
    setShowBridgeTokenMenu(false);
  };

  return (
    <div className="min-h-screen bg-bg text-cream" onClick={closeAllMenus}>
      <Topbar />
      <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row">
        <Sidebar activePage="swap" />

        <main className="relative flex-1 overflow-hidden p-5 sm:p-8">
          <div className="pointer-events-none absolute right-12 top-10 h-44 w-44 rounded-full bg-mint/10 blur-3xl" />
          <div className="relative mx-auto max-w-xl">
            {/* Header */}
            <div className="mb-8 pb-8 border-b border-[#2a2a26]">
              <h1 className="text-5xl font-bold tracking-tight text-cream">Swap & Bridge</h1>
              <div className="mt-3 h-1 w-12 rounded-full bg-mint" />
              <p className="mt-4 text-base leading-relaxed text-muted">
                Swap tokens or bridge assets across chains — powered by native DEX routing on Rialo Network.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex border-b border-[#2a2a26]">
              {(["swap", "bridge"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveTab(tab); closeAllMenus(); }}
                  className={`mr-6 pb-3 text-sm font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-mint text-cream"
                      : "text-muted hover:text-cream"
                  }`}
                >
                  {tab === "swap" ? "Swap" : "Bridge"}
                </button>
              ))}
            </div>

            {/* ── SWAP TAB ── */}
            {activeTab === "swap" && (
              <div>
                <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6">
                  {/* You pay */}
                  <div className="rounded-2xl bg-bg p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">You pay</p>
                    <div className="flex items-center gap-3">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowPayMenu((p) => !p); setShowReceiveMenu(false); }}
                          className="flex min-w-[140px] items-center gap-3 rounded-2xl border border-[#2a2a26] bg-surface-2 px-4 py-3 transition-colors hover:border-mint/40"
                        >
                          <TokenLogo token={payToken} />
                          <span className="text-base font-semibold text-cream">{payToken}</span>
                          <ChevronDown className="ml-auto h-4 w-4 text-muted" />
                        </button>
                        {showPayMenu && (
                          <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-2xl border border-[#2a2a26] bg-surface shadow-xl">
                            {SWAP_TOKENS.filter((t) => t !== receiveToken).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => { setPayToken(t); setShowPayMenu(false); }}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-2 ${payToken === t ? "text-mint" : "text-cream"}`}
                              >
                                <TokenLogo token={t} size="sm" />
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="w-full bg-transparent text-right text-4xl font-bold text-cream outline-none placeholder:text-muted/30"
                      />
                    </div>
                    <p className="mt-3 text-right text-xs text-muted">Balance: 0.00</p>
                  </div>

                  {/* Flip tokens button */}
                  <div className="flex justify-center py-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleFlipTokens(); }}
                      className="relative z-10 -my-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a26] bg-surface-2 text-muted transition-all hover:border-mint/40 hover:text-mint"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* You receive */}
                  <div className="rounded-2xl bg-bg p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">You receive</p>
                    <div className="flex items-center gap-3">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowReceiveMenu((p) => !p); setShowPayMenu(false); }}
                          className="flex min-w-[140px] items-center gap-3 rounded-2xl border border-[#2a2a26] bg-surface-2 px-4 py-3 transition-colors hover:border-mint/40"
                        >
                          <TokenLogo token={receiveToken} />
                          <span className="text-base font-semibold text-cream">{receiveToken}</span>
                          <ChevronDown className="ml-auto h-4 w-4 text-muted" />
                        </button>
                        {showReceiveMenu && (
                          <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-2xl border border-[#2a2a26] bg-surface shadow-xl">
                            {SWAP_TOKENS.filter((t) => t !== payToken).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => { setReceiveToken(t); setShowReceiveMenu(false); }}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-2 ${receiveToken === t ? "text-mint" : "text-cream"}`}
                              >
                                <TokenLogo token={t} size="sm" />
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="w-full text-right text-4xl font-bold text-muted/40">0.00</p>
                    </div>
                    <p className="mt-3 text-right text-xs text-muted">
                      1 {payToken} ≈ 1 {receiveToken}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    title="Coming on Rialo testnet — swaps will route through a native Rialo DEX"
                    className="mt-5 w-full cursor-not-allowed rounded-2xl bg-mint/20 py-4 text-base font-bold text-mint/40"
                  >
                    Swap
                  </button>
                </div>

                <p className="mt-3 text-center text-sm text-muted">
                  1 {payToken} ≈ 1 {receiveToken} · Powered by Rialo DEX
                </p>
                <p className="mt-4 text-center text-sm leading-relaxed text-muted">
                  Swap routing will be powered by a native DEX on Rialo testnet. ONYX connects you to liquidity without leaving the app.
                </p>
                <div className="mt-5 rounded-2xl border border-[#2a2a26] bg-surface p-5">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                    <div>
                      <p className="text-sm font-semibold text-cream">Currently testing on Sepolia</p>
                      <p className="mt-1 text-xs leading-5 text-muted">
                        USDC and USDT are available on Sepolia testnet. $RIALO test token coming soon.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── BRIDGE TAB ── */}
            {activeTab === "bridge" && (
              <div>
                <div className="rounded-3xl border border-[#2a2a26] bg-surface p-6">
                  {/* Bridge from */}
                  <div className="rounded-2xl bg-bg p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Bridge from</p>
                    <div className="flex flex-col gap-3">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowFromChainMenu((p) => !p); setShowToChainMenu(false); setShowBridgeTokenMenu(false); }}
                          className="flex w-full items-center gap-3 rounded-2xl border border-[#2a2a26] bg-surface-2 px-4 py-3 transition-colors hover:border-mint/40"
                        >
                          <ChainLogo chain={fromChain} />
                          <span className="flex-1 text-left text-base font-semibold text-cream">{fromChain}</span>
                          <ChevronDown className="h-4 w-4 text-muted" />
                        </button>
                        {showFromChainMenu && (
                          <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-2xl border border-[#2a2a26] bg-surface shadow-xl">
                            {CHAINS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => { setFromChain(c); setShowFromChainMenu(false); }}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-2 ${fromChain === c ? "text-mint" : "text-cream"}`}
                              >
                                <ChainLogo chain={c} />
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => { setShowBridgeTokenMenu((p) => !p); setShowFromChainMenu(false); }}
                            className="flex min-w-[130px] items-center gap-3 rounded-2xl border border-[#2a2a26] bg-surface-2 px-4 py-3 transition-colors hover:border-mint/40"
                          >
                            <TokenLogo token={bridgeToken} />
                            <span className="text-base font-semibold text-cream">{bridgeToken}</span>
                            <ChevronDown className="ml-auto h-4 w-4 text-muted" />
                          </button>
                          {showBridgeTokenMenu && (
                            <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-2xl border border-[#2a2a26] bg-surface shadow-xl">
                              {BRIDGE_TOKENS.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => { setBridgeToken(t); setShowBridgeTokenMenu(false); }}
                                  className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-2 ${bridgeToken === t ? "text-mint" : "text-cream"}`}
                                >
                                  <TokenLogo token={t} size="sm" />
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          type="number"
                          min="0"
                          placeholder="0.00"
                          value={bridgeAmount}
                          onChange={(e) => setBridgeAmount(e.target.value)}
                          className="w-full bg-transparent text-right text-4xl font-bold text-cream outline-none placeholder:text-muted/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Flip chains button */}
                  <div className="flex justify-center py-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleFlipChains(); }}
                      className="relative z-10 -my-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a26] bg-surface-2 text-muted transition-all hover:border-mint/40 hover:text-mint"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Bridge to */}
                  <div className="rounded-2xl bg-bg p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Bridge to</p>
                    <div className="flex flex-col gap-3">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowToChainMenu((p) => !p); setShowFromChainMenu(false); setShowBridgeTokenMenu(false); }}
                          className="flex w-full items-center gap-3 rounded-2xl border border-[#2a2a26] bg-surface-2 px-4 py-3 transition-colors hover:border-mint/40"
                        >
                          <ChainLogo chain={toChain} />
                          <span className="flex-1 text-left text-base font-semibold text-cream">{toChain}</span>
                          <ChevronDown className="h-4 w-4 text-muted" />
                        </button>
                        {showToChainMenu && (
                          <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-2xl border border-[#2a2a26] bg-surface shadow-xl">
                            {CHAINS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => { setToChain(c); setShowToChainMenu(false); }}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-2 ${toChain === c ? "text-mint" : "text-cream"}`}
                              >
                                <ChainLogo chain={c} />
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex min-w-[130px] items-center gap-3 rounded-2xl border border-[#2a2a26] bg-surface-2 px-4 py-3 opacity-60">
                          <TokenLogo token={bridgeToken} />
                          <span className="text-base font-semibold text-cream">{bridgeToken}</span>
                        </div>
                        <p className="w-full text-right text-4xl font-bold text-muted/40">0.00</p>
                      </div>

                      <input
                        type="text"
                        placeholder="0x... or wallet address on destination chain (optional)"
                        value={receivingWallet}
                        onChange={(e) => setReceivingWallet(e.target.value)}
                        className="w-full rounded-2xl border border-[#2a2a26] bg-surface-2 px-4 py-3 text-sm text-cream placeholder:text-muted outline-none transition-colors focus:border-mint/40"
                      />
                    </div>
                  </div>

                  {/* Same-chain validation */}
                  {sameChain && (
                    <p className="mt-3 text-center text-xs text-red-400">
                      Source and destination chains must be different
                    </p>
                  )}

                  <button
                    type="button"
                    disabled
                    title="Coming on Rialo testnet"
                    className="mt-3 w-full cursor-not-allowed rounded-2xl bg-mint/20 py-4 text-base font-bold text-mint/40"
                  >
                    Bridge {fromChain} → {toChain}
                  </button>
                </div>

                <p className="mt-4 text-center text-sm leading-relaxed text-muted">
                  Bridge routing will connect Rialo Network to other chains via native on-chain DEX integrations. No third-party bridges.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
