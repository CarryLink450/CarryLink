import { PageHeader } from "@/components/PageHeader";

const faqs = [
  ["Is CarryLink a shipping company?", "No. This MVP is a matching platform concept. Users coordinate directly and remain responsible for legal compliance and delivery arrangements."],
  ["Can travelers inspect items?", "Yes. Travelers should only accept items they can inspect and understand. Senders should never ask someone to carry hidden or undeclared goods."],
  ["How does matching work?", "The matching system scores route, city, country, date proximity, and item weight compatibility."],
  ["How will real authentication work later?", "The project is structured so Supabase Auth, database tables, storage, and realtime chat can be added behind the existing interfaces."],
  ["Who sets compensation?", "Senders and travelers agree on compensation in chat before handoff."]
];

export default function FAQPage() {
  return (
    <>
      <PageHeader title="FAQ" description="Answers for the MVP experience and the future product direction." />
      <section className="section max-w-4xl">
        <div className="grid gap-4">
          {faqs.map(([question, answer]) => (
            <details key={question} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" open={question === faqs[0][0]}>
              <summary className="cursor-pointer text-lg font-semibold text-ink">{question}</summary>
              <p className="mt-3 leading-7 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
