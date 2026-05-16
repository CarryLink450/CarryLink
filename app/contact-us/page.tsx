import { Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function ContactUsPage() {
  return (
    <>
      <PageHeader
        title="Contact us"
        description="We are here to help with technical issues, website feedback, recommendations, and collaboration opportunities."
      />
      <section className="section max-w-4xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <p className="max-w-3xl leading-7 text-slate-600">
            If you face any technical issue while using CarryLink, notice something that does not work as expected, or want to share a comment, recommendation, or collaboration idea, please contact us. We welcome feedback that helps improve the platform and create a safer, clearer experience for senders and travelers.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a href="tel:+18194436623" className="flex items-center gap-3 rounded-lg bg-skywash p-4 font-semibold text-trust hover:bg-trust hover:text-white">
              <Phone size={20} aria-hidden />
              +1 819 443 6623
            </a>
            <a href="mailto:info@carrylink.net" className="flex items-center gap-3 rounded-lg bg-skywash p-4 font-semibold text-trust hover:bg-trust hover:text-white">
              <Mail size={20} aria-hidden />
              info@carrylink.net
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
