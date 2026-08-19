import type { PrivyClientConfig } from "@privy-io/react-auth";
import { sepolia } from "@/lib/chain";

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["email", "google", "twitter", "wallet"],
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
  defaultChain: sepolia,
  supportedChains: [sepolia],
  appearance: {
    theme: "dark",
    accentColor: "#BCEDE2",
  },
};