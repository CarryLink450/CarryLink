import type { MatchStrength } from "@/types";

const styleByStrength: Record<MatchStrength, string> = {
  "Strong Match": "bg-trust text-white",
  "Good Match": "bg-wheat text-ink",
  "Possible Match": "bg-slate-100 text-slate-700"
};

export function MatchBadge({ strength }: { strength: MatchStrength }) {
  return (
    <span className={`inline-flex min-h-10 min-w-24 items-center justify-center rounded-full px-3 py-1 text-center text-xs font-semibold leading-tight ${styleByStrength[strength]}`}>
      {strength}
    </span>
  );
}
