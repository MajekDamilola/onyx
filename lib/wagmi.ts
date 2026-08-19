import { createConfig, http } from "wagmi";
import { sepolia } from "@/lib/chain";
import { SEPOLIA_RPC_URL } from "@/lib/alchemy";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC_URL || undefined),
  },
});
