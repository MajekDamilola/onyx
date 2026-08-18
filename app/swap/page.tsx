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

const TOKEN_LOGOS: Record<SwapToken, string> = {
  USDC:  "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  USDT:  "https://cryptologos.cc/logos/tether-usdt-logo.png",
  RIALO: "/rialo-logo.svg",
};

const CHAIN_LOGOS: Record<Chain, { src: string; bg?: string }> = {
  Rialo:    { src: "/rialo-logo.svg" },
  Ethereum: { src: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  Solana:   { src: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  Base:     { src: "https://raw.githubusercontent.com/base-org/brand-kit/001c0e9b40a67799ebe0418671ac4e02a0c683ce/logo/in-product/Base_Network_Logo.svg", bg: "bg-[#0052FF] p-0.5" },
};

const SWAP_TOKENS: SwapToken[] = ["USDC", "USDT", "RIALO"];
const BRIDGE_TOKENS: BridgeToken[] = ["USDC", "USDT"];
const CHAINS: Chain[] = ["Rialo", "Ethereum", "Solana", "Base"];

function TokenLogo({ token, size = "md" }: { token: SwapToken; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  return (
    <img
      src={TOKEN_LOGOS[token]}
      alt={token}
      className={`${dim} rounded-full object-contain flex-shrink-0`}
    />
  );
}

function ChainLogo({ chain }: { chain: Chain }) {
  const { src, bg } = CHAIN_LOGOS[chain];
  return (
    <img
      src={src}
      alt={chain}
      className={`h-6 w-6 rounded-full object-contain flex-shrink-0 ${bg ?? ""}`}
    />
  );
}

export default function SwapPage() {
  const { authenticated, ready } = usePrivy();
  const router = useRouter();

  const [payToken, setPayToken] = useState<SwapToken>("USDC");
  const [receiveToken, setReceiveToken] = useState<SwapToken>("USDT");
  const [payAmount, setPayAmount] = useState("");
  const [showPayMenu, setShowPayMenu] = useState(false);
  const [showReceiveMenu, setShowReceiveMenu] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-[#090A0A]">
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

  const dropdownBtnCls = "flex items-center gap-2.5 rounded-[8px] border border-[#252929] bg-[#131515] px-3 py-2.5 transition-colors hover:border-[#BCEDE2]/30";
  const dropdownMenuCls = "absolute top-full z-20 mt-1 w-full overflow-hidden rounded-[8px] border border-[#252929] bg-[#0E1010] shadow-xl";

  return (
    <div className="min-h-screen bg-[#090A0A] text-cream" onClick={closeAllMenus}>
      <Topbar />
      <div className="flex min-h-[calc(100vh-56px)] flex-col md:flex-row">
        <Sidebar activePage="swap" />

        <main className="flex-1 overflow-hidden p-5 sm:p-8">
          <div className="relative mx-auto max-w-xl">
            {/* Header */}
            <div className="mb-8 border-b border-[#252929] pb-8">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A9E9B]">Exchange</p>
              <h1 className="text-4xl font-black tracking-tight text-cream">Swap & Bridge</h1>
              <p className="mt-4 text-sm leading-6 text-muted">
                Swap tokens or bridge assets across chains — powered by native DEX routing on Rialo Network.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex border-b border-[#252929]">
              {(["swap", "bridge"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveTab(tab); closeAllMenus(); }}
                  className={`mr-6 pb-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-[#BCEDE2] text-cream"
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
                <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
                  {/* You pay */}
                  <div className="rounded-[8px] bg-[#131515] p-4">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">You pay</p>
                    <div className="flex items-center gap-3">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowPayMenu((p) => !p); setShowReceiveMenu(false); }}
                          className={`${dropdownBtnCls} min-w-[130px]`}
                        >
                          <TokenLogo token={payToken} />
                          <span className="text-sm font-semibold text-cream">{payToken}</span>
                          <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted" />
                        </button>
                        {showPayMenu && (
                          <div className={dropdownMenuCls}>
                            {SWAP_TOKENS.filter((t) => t !== receiveToken).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => { setPayToken(t); setShowPayMenu(false); }}
                                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#131515] ${payToken === t ? "text-[#BCEDE2]" : "text-cream"}`}
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
                        className="w-full bg-transparent text-right text-3xl font-black tracking-tight text-cream outline-none placeholder:text-muted/30"
                      />
                    </div>
                    <p className="mt-2 text-right text-[10px] text-muted">Balance: 0.00</p>
                  </div>

                  {/* Flip */}
                  <div className="flex justify-center py-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleFlipTokens(); }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#252929] bg-[#0E1010] text-muted transition-all hover:border-[#BCEDE2]/30 hover:text-[#BCEDE2]"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* You receive */}
                  <div className="rounded-[8px] bg-[#131515] p-4">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">You receive</p>
                    <div className="flex items-center gap-3">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowReceiveMenu((p) => !p); setShowPayMenu(false); }}
                          className={`${dropdownBtnCls} min-w-[130px]`}
                        >
                          <TokenLogo token={receiveToken} />
                          <span className="text-sm font-semibold text-cream">{receiveToken}</span>
                          <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted" />
                        </button>
                        {showReceiveMenu && (
                          <div className={dropdownMenuCls}>
                            {SWAP_TOKENS.filter((t) => t !== payToken).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => { setReceiveToken(t); setShowReceiveMenu(false); }}
                                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#131515] ${receiveToken === t ? "text-[#BCEDE2]" : "text-cream"}`}
                              >
                                <TokenLogo token={t} size="sm" />
                                {t}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="w-full text-right text-3xl font-black tracking-tight text-muted/30">0.00</p>
                    </div>
                    <p className="mt-2 text-right text-[10px] text-muted">
                      1 {payToken} ≈ 1 {receiveToken}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    title="Coming on Rialo testnet — swaps will route through a native Rialo DEX"
                    className="mt-4 w-full cursor-not-allowed rounded-[8px] bg-[#BCEDE2]/10 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#BCEDE2]/30"
                  >
                    Swap
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-muted">
                  1 {payToken} ≈ 1 {receiveToken} · Powered by Rialo DEX
                </p>
                <p className="mt-3 text-center text-xs leading-5 text-muted">
                  Swap routing will be powered by a native DEX on Rialo testnet. ONYX connects you to liquidity without leaving the app.
                </p>
                <div className="mt-4 rounded-[12px] border border-[#252929] bg-[#0E1010] p-4">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#BCEDE2]" />
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
                <div className="rounded-[12px] border border-[#252929] bg-[#0E1010] p-5">
                  {/* Bridge from */}
                  <div className="rounded-[8px] bg-[#131515] p-4">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Bridge from</p>
                    <div className="flex flex-col gap-2.5">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowFromChainMenu((p) => !p); setShowToChainMenu(false); setShowBridgeTokenMenu(false); }}
                          className={`${dropdownBtnCls} w-full`}
                        >
                          <ChainLogo chain={fromChain} />
                          <span className="flex-1 text-left text-sm font-semibold text-cream">{fromChain}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-muted" />
                        </button>
                        {showFromChainMenu && (
                          <div className={dropdownMenuCls}>
                            {CHAINS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => { setFromChain(c); setShowFromChainMenu(false); }}
                                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#131515] ${fromChain === c ? "text-[#BCEDE2]" : "text-cream"}`}
                              >
                                <ChainLogo chain={c} />
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => { setShowBridgeTokenMenu((p) => !p); setShowFromChainMenu(false); }}
                            className={`${dropdownBtnCls} min-w-[120px]`}
                          >
                            <TokenLogo token={bridgeToken} />
                            <span className="text-sm font-semibold text-cream">{bridgeToken}</span>
                            <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted" />
                          </button>
                          {showBridgeTokenMenu && (
                            <div className={dropdownMenuCls}>
                              {BRIDGE_TOKENS.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => { setBridgeToken(t); setShowBridgeTokenMenu(false); }}
                                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#131515] ${bridgeToken === t ? "text-[#BCEDE2]" : "text-cream"}`}
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
                          className="w-full bg-transparent text-right text-3xl font-black tracking-tight text-cream outline-none placeholder:text-muted/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Flip chains */}
                  <div className="flex justify-center py-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleFlipChains(); }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#252929] bg-[#0E1010] text-muted transition-all hover:border-[#BCEDE2]/30 hover:text-[#BCEDE2]"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Bridge to */}
                  <div className="rounded-[8px] bg-[#131515] p-4">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Bridge to</p>
                    <div className="flex flex-col gap-2.5">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => { setShowToChainMenu((p) => !p); setShowFromChainMenu(false); setShowBridgeTokenMenu(false); }}
                          className={`${dropdownBtnCls} w-full`}
                        >
                          <ChainLogo chain={toChain} />
                          <span className="flex-1 text-left text-sm font-semibold text-cream">{toChain}</span>
                          <ChevronDown className="h-3.5 w-3.5 text-muted" />
                        </button>
                        {showToChainMenu && (
                          <div className={dropdownMenuCls}>
                            {CHAINS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => { setToChain(c); setShowToChainMenu(false); }}
                                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-[#131515] ${toChain === c ? "text-[#BCEDE2]" : "text-cream"}`}
                              >
                                <ChainLogo chain={c} />
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="flex min-w-[120px] items-center gap-2.5 rounded-[8px] border border-[#252929] bg-[#131515] px-3 py-2.5 opacity-60">
                          <TokenLogo token={bridgeToken} />
                          <span className="text-sm font-semibold text-cream">{bridgeToken}</span>
                        </div>
                        <p className="w-full text-right text-3xl font-black tracking-tight text-muted/30">0.00</p>
                      </div>

                      <input
                        type="text"
                        placeholder="0x... destination address (optional)"
                        value={receivingWallet}
                        onChange={(e) => setReceivingWallet(e.target.value)}
                        className="w-full rounded-[8px] border border-[#252929] bg-[#0E1010] px-3 py-2.5 text-sm text-cream placeholder:text-muted outline-none transition-colors focus:border-[#BCEDE2]/30"
                      />
                    </div>
                  </div>

                  {sameChain && (
                    <p className="mt-3 text-center text-[10px] text-red-400">
                      Source and destination chains must be different
                    </p>
                  )}

                  <button
                    type="button"
                    disabled
                    title="Coming on Rialo testnet"
                    className="mt-3 w-full cursor-not-allowed rounded-[8px] bg-[#BCEDE2]/10 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#BCEDE2]/30"
                  >
                    Bridge {fromChain} → {toChain}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-muted">
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
