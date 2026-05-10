import { PageHeader } from "@/components/PageHeader";
import { brandName } from "@/lib/utils";

const sections = [
  {
    title: "1. Acceptance of These Terms",
    body: [
      `By accessing or using ${brandName}, you agree to these Terms of Service. If you do not agree, do not use the website.`,
      "These terms apply to all users, including senders, requesters, travelers, carriers, visitors, and any person using the platform."
    ]
  },
  {
    title: "2. Platform Role",
    body: [
      `${brandName} is a peer-to-peer matching and communication platform. It helps users discover possible delivery matches and communicate about trips, delivery requests, handoff details, and compensation.`,
      `${brandName} is not a shipping company, courier, freight forwarder, customs broker, airline, inspection service, escrow provider, insurance provider, or party to agreements between users.`,
      "Any agreement between a sender and a traveler is made directly between those users. Users are solely responsible for deciding whether to proceed."
    ]
  },
  {
    title: "3. User Responsibilities",
    body: [
      "Users are responsible for providing accurate, truthful, complete, and lawful information.",
      "Users are responsible for verifying identities, item details, travel details, pickup details, delivery details, compensation, and any documentation required by law.",
      "Users must comply with all applicable airline, airport, customs, import, export, tax, security, and destination-country rules."
    ]
  },
  {
    title: "4. Prohibited Items and Misuse",
    body: [
      "Users must not use the platform to send, carry, request, hide, disguise, or facilitate illegal, dangerous, prohibited, restricted, stolen, counterfeit, undeclared, or misleadingly described items.",
      "Prohibited or restricted examples include drugs, controlled substances, weapons, ammunition, cash over legal limits, undeclared valuables, alcohol or tobacco where restricted, restricted batteries or electronics, medicine without proper authorization, and any customs-restricted item.",
      "Users must not pressure another user to carry an item, avoid inspection, misrepresent contents, bypass customs, violate airline rules, or break any law."
    ]
  },
  {
    title: "5. No Guarantee of Delivery or User Conduct",
    body: [
      `${brandName} does not guarantee that any item will be accepted, transported, delivered, returned, paid for, or handled safely.`,
      `${brandName} does not guarantee user identity, trustworthiness, travel plans, item legality, item condition, compensation, or successful delivery.`,
      "Users should use their own judgment and decline any request or trip that feels unclear, unsafe, illegal, or uncomfortable."
    ]
  },
  {
    title: "6. User Agreements and Payments",
    body: [
      "Any compensation or payment arrangement is agreed directly between users.",
      `${brandName} is not responsible for payment disputes, refunds, cancellations, missed handoffs, failed delivery, damaged items, lost items, customs seizure, travel delays, or disagreement between parties.`,
      "Users should document all important details in writing before any handoff."
    ]
  },
  {
    title: "7. Account Safety",
    body: [
      "You are responsible for keeping your account credentials secure and for all activity under your account.",
      "You must not impersonate another person, create misleading listings, use false contact information, or use the platform for fraud, spam, harassment, or unlawful conduct."
    ]
  },
  {
    title: "8. Limitation of Liability",
    body: [
      `To the maximum extent permitted by law, ${brandName}, its owner, operators, developers, affiliates, and service providers are not liable for losses, damages, claims, penalties, legal consequences, customs actions, airline actions, injuries, disputes, failed deliveries, or misuse arising from user interactions or platform use.`,
      "Users use the platform at their own risk."
    ]
  },
  {
    title: "9. Content Removal and Account Restrictions",
    body: [
      `${brandName} may remove listings, restrict accounts, or block access if activity appears suspicious, unsafe, unlawful, misleading, abusive, or inconsistent with these terms.`,
      "The platform may cooperate with lawful requests from authorities when required."
    ]
  },
  {
    title: "10. Changes to These Terms",
    body: [
      "These terms may be updated as the platform evolves. Continued use after updates means you accept the revised terms."
    ]
  }
];

export default function TermsOfServicePage() {
  return (
    <>
      <PageHeader title="Terms of Service" description={`Rules and responsibilities for using ${brandName}.`} />
      <section className="section max-w-4xl">
        <div className="grid gap-5">
          {sections.map((section) => (
            <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-slate-600">{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
