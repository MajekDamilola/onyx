export const SEPOLIA_TOKENS: Record<"USDC" | "USDT", `0x${string}`> = {
  USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  USDT: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
};

export function symbolForTokenAddress(address: string): "USDC" | "USDT" | null {
  const lower = address.toLowerCase();
  if (lower === SEPOLIA_TOKENS.USDC.toLowerCase()) return "USDC";
  if (lower === SEPOLIA_TOKENS.USDT.toLowerCase()) return "USDT";
  return null;
}
