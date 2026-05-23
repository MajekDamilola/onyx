"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "@/lib/privy";
import { sepolia } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
  const privyAppId =
    appId === "placeholder" ? "placeholder00000000000000" : appId;

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        ...privyConfig,
        defaultChain: sepolia,
        supportedChains: [sepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
