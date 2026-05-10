import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline";

const styles: Record<Variant, string> = {
  primary: "bg-trust text-white hover:bg-ink",
  secondary: "bg-coral text-white hover:bg-ink",
  outline: "border border-slate-300 bg-white text-ink hover:border-trust hover:text-trust"
};

export function ButtonLink({
  href,
  children,
  variant = "primary"
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${styles[variant]}`}>
      {children}
    </Link>
  );
}
