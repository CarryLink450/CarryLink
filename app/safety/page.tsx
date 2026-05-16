import { AlertTriangle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const prohibited = [
  "Drugs or controlled substances",
  "Weapons, ammunition, or weapon parts",
  "Cash over legal limits or undeclared valuables",
  "Alcohol or tobacco where restricted",
  "Batteries, power banks, or electronics restricted by airline rules",
  "Medicine without prescription or required authorization",
  "Any customs-restricted or destination-country restricted item"
];

export default function SafetyPage() {
  return (
    <>
      <PageHeader title="Safety guidelines" description="CarryLink is designed for transparent, lawful, small-item coordination. Every user is responsible for compliance." />
      <section className="section grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-coral/30 bg-white p-6 shadow-soft">
          <AlertTriangle className="text-coral" size={30} aria-hidden />
          <h2 className="mt-4 text-2xl font-semibold text-ink">Never send restricted items</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
            {prohibited.map((item) => <li key={item} className="rounded-lg bg-coral/5 p-3">{item}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <ShieldCheck className="text-trust" size={30} aria-hidden />
          <h2 className="mt-4 text-2xl font-semibold text-ink">User responsibility disclaimer</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Users are responsible for following airline, airport, customs, and destination-country laws. The platform does not inspect items, does not provide legal advice, and does not guarantee delivery.
          </p>
          <p className="mt-4 leading-7 text-slate-600">
            Travelers should inspect items, decline anything unclear, avoid sealed packages they cannot verify, and keep written confirmation of the agreed contents. Senders should accurately describe every item and provide documentation when required.
          </p>
        </div>
      </section>
    </>
  );
}
