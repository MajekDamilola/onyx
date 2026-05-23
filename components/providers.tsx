"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "@/lib/privy";
import { sepolia } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
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
