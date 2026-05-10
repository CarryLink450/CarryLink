import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { brandName } from "@/lib/utils";

const disclaimers = [
  "The platform is provided for peer-to-peer matching and communication only.",
  "The platform owner is not responsible for user agreements, item contents, handoffs, delivery results, travel delays, payment disputes, loss, damage, customs seizure, airline refusal, legal penalties, or misuse.",
  "Users are solely responsible for confirming that all items are legal, permitted, declared when required, and compliant with airline, airport, customs, origin-country, transit-country, and destination-country rules.",
  "The platform does not inspect packages, verify item legality, verify user identity beyond available account information, supervise handoffs, provide insurance, or guarantee delivery.",
  "Travelers should refuse sealed, suspicious, unclear, illegal, dangerous, restricted, or undeclared items.",
  "Senders must accurately describe items and must not ask travelers to carry anything illegal, restricted, hidden, dangerous, or misleadingly described.",
  "Users should meet safely, communicate clearly, keep written records, and use independent judgment before proceeding.",
  "Use of the platform is at each user's own risk."
];

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader title="Disclaimer" description={`Important limits on ${brandName}'s responsibility and user obligations.`} />
      <section className="section max-w-4xl">
        <div className="rounded-lg border border-coral/30 bg-white p-6 shadow-soft">
          <AlertTriangle className="text-coral" size={30} aria-hidden />
          <h2 className="mt-4 text-2xl font-semibold text-ink">Important Notice</h2>
          <p className="mt-4 leading-7 text-slate-600">
            {brandName} is not a courier, shipping company, inspection provider, customs broker, escrow service, insurer, legal advisor, or party to transactions between users.
          </p>
          <div className="mt-5 grid gap-3">
            {disclaimers.map((item) => (
              <p key={item} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">{item}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
