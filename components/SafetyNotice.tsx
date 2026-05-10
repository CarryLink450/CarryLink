import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function SafetyNotice() {
  return (
    <div className="rounded-lg border border-coral/30 bg-white p-4 shadow-soft">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 shrink-0 text-coral" size={22} aria-hidden />
        <div>
          <p className="font-semibold text-ink">Safety and customs notice</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Do not send prohibited, illegal, dangerous, restricted, or undeclared items. Users are responsible for following airline, airport, customs, and destination-country laws. {""}
            <Link className="font-semibold text-trust" href="/safety">Read guidelines</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
