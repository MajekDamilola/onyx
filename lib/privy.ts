import type { PrivyClientConfig } from "@privy-io/react-auth";
import { sepolia } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["email", "google", "twitter", "wallet"],
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
  },
  defaultChain: sepolia,
  supportedChains: [sepolia],
  appearance: {
    theme: "dark" as const,
    accentColor: "#BBEBE1" as const,
    logo: "",
  },
};
