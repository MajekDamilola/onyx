import { defineChain } from "viem";
import { sepolia as viemSepolia } from "viem/chains";
import { SEPOLIA_RPC_URL } from "@/lib/alchemy";

/**
 * Sepolia, with its default RPC pointed at our funded Alchemy endpoint
 * instead of viem's public default (sepolia.drpc.org), which rate-limits
 * eth_getTransactionCount and other calls on its free tier — Privy's
 * embedded wallet uses this chain's default RPC internally when signing,
 * regardless of the transport passed to wagmi or createPublicClient.
 *
 * Falls back to viem's stock chain (and its public RPC) only if the env
 * var isn't configured, so a missing var degrades rather than crashes.
 */
export const sepolia = SEPOLIA_RPC_URL
  ? defineChain({
      ...viemSepolia,
      rpcUrls: {
        default: { http: [SEPOLIA_RPC_URL] },
      },
    })
  : viemSepolia;
