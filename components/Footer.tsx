import Link from "next/link";
import { brandName } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-semibold text-ink">{brandName}</p>
          <p className="mt-2 max-w-md">
            A mock MVP for trusted peer-to-peer travel delivery matching. Users remain responsible for all customs, airline, and legal requirements.
          </p>
        </div>
        <div className="grid gap-2">
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
        <div className="grid gap-2">
          <Link href="/safety">Safety guidelines</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/profile">Profile</Link>
        </div>
      </div>
    </footer>
  );
}
