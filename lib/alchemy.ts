import { SEPOLIA_TOKENS, symbolForTokenAddress } from "@/lib/tokens";

export const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC || "";

export interface ReceivedTransfer {
  hash: string;
  token: "USDC" | "USDT";
  amount: string;
  from: string;
  timestamp: number;
}

/**
 * Reads real incoming USDC/USDT transfers to `address` on Sepolia via Alchemy's
 * enhanced `alchemy_getAssetTransfers` API. Returns [] on any failure (missing
 * RPC config, network error, malformed response) rather than throwing, since
 * this only ever backs a supplementary "Received" view.
 */
export async function fetchReceivedTransfers(address: string): Promise<ReceivedTransfer[]> {
  if (!SEPOLIA_RPC_URL || !address) return [];

  try {
    const res = await fetch(SEPOLIA_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            toAddress: address,
            contractAddresses: [SEPOLIA_TOKENS.USDC, SEPOLIA_TOKENS.USDT],
            category: ["erc20"],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: "0x64",
          },
        ],
      }),
    });

    if (!res.ok) return [];
    const json = await res.json();
    const transfers = json?.result?.transfers;
    if (!Array.isArray(transfers)) return [];

    return transfers
      .map((t): ReceivedTransfer | null => {
        const symbol = symbolForTokenAddress(t?.rawContract?.address || "");
        if (!symbol || typeof t?.value !== "number") return null;
        const ts = Date.parse(t?.metadata?.blockTimestamp || "");
        return {
          hash: t.hash,
          token: symbol,
          amount: t.value.toString(),
          from: t.from,
          timestamp: Number.isNaN(ts) ? 0 : ts,
        };
      })
      .filter((t): t is ReceivedTransfer => t !== null);
  } catch {
    return [];
  }
}
