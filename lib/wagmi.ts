import { createConfig, http } from "wagmi";
import { sepolia } from "viem/chains";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/NOXqRYkZ3ATw-AZViYHutp98zLOa-bbp"),
  },
});
