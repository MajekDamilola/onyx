import { createConfig, http } from "wagmi";
import { sepolia } from "viem/chains";
import { SEPOLIA_RPC_URL } from "@/lib/alchemy";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC_URL || undefined),
  },
});
