export default function OnyxMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M50,8 L86,30 L86,70 L50,92 L14,70 L14,30 Z" />
      <path d="M50,8 L50,92 M28,38 L50,52 L72,38" />
    </svg>
  );
}
