import { PageHeader } from "@/components/PageHeader";
import { brandName } from "@/lib/utils";

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "We may collect account information such as full name, email address, phone number, current country, home country, user type, and profile photo.",
      "We may collect listing information such as trip routes, travel dates, luggage space, item restrictions, delivery requests, item descriptions, compensation preferences, and meeting preferences.",
      "We may collect communication information such as conversations and messages exchanged through the platform."
    ]
  },
  {
    title: "2. How We Use Information",
    body: [
      "We use information to create accounts, display profiles, post trips, create delivery requests, suggest matches, support messaging, improve safety, and operate the website.",
      "We may use information to investigate suspicious activity, enforce platform rules, protect users, debug technical issues, and comply with legal obligations."
    ]
  },
  {
    title: "3. Information Shared With Other Users",
    body: [
      "Profile, trip, request, and message information may be visible to other users when needed for matching and communication.",
      "Do not include sensitive personal information, financial information, identity documents, or confidential information in public listing fields unless absolutely necessary."
    ]
  },
  {
    title: "4. Service Providers",
    body: [
      `${brandName} uses third-party service providers to operate the website, including hosting, database, authentication, storage, analytics, advertising, and email or communication services.`,
      "These providers may process data only as needed to provide their services, subject to their own terms and privacy practices."
    ]
  },
  {
    title: "5. Advertising and Cookies",
    body: [
      "The website may use advertising services such as Google AdSense. Advertising providers may use cookies, device identifiers, or similar technologies to display, measure, and personalize ads where permitted.",
      "Users can manage cookies and advertising preferences through browser settings and applicable advertising controls."
    ]
  },
  {
    title: "6. Legal and Safety Disclosures",
    body: [
      "We may preserve or disclose information if required by law, legal process, safety concerns, platform misuse, fraud prevention, user protection, or enforcement of our terms.",
      "Users remain responsible for ensuring their own compliance with airline, customs, and legal rules."
    ]
  },
  {
    title: "7. Data Security",
    body: [
      "We use reasonable technical and organizational measures to protect account and platform data.",
      "No website or internet transmission is completely secure. Users should protect their passwords and avoid sharing unnecessary sensitive information."
    ]
  },
  {
    title: "8. Data Accuracy and Account Updates",
    body: [
      "Users should keep profile and contact information accurate.",
      "Incorrect information may affect matching, messaging, account access, and safety."
    ]
  },
  {
    title: "9. Data Retention",
    body: [
      "We may retain information as long as needed to operate the platform, resolve disputes, enforce terms, protect users, comply with legal obligations, and maintain business records.",
      "Some information may remain in backups or logs for a limited time after deletion."
    ]
  },
  {
    title: "10. Contact and Review",
    body: [
      "Users may request help with account or privacy questions through the contact methods provided by the platform owner."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" description={`How ${brandName} may collect, use, and protect user information.`} />
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
