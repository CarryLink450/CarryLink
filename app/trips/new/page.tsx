import { FormSection } from "@/components/FormSection";
import { PageHeader } from "@/components/PageHeader";
import { SafetyNotice } from "@/components/SafetyNotice";
import { createTripAction } from "@/app/actions";

export default async function PostTripPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader title="Post a trip" description="List your travel route, available space, item restrictions, and meeting preferences." />
      <section className="section max-w-5xl">
        <form action={createTripAction} className="grid gap-6">
          {params.error ? (
            <p className="rounded-lg bg-coral/10 p-4 text-sm font-medium text-coral">
              Trip was not saved: {params.error}
            </p>
          ) : null}
          <SafetyNotice />
          <FormSection title="Route and dates">
            <div><label className="label" htmlFor="fromCountry">From country</label><input className="field" id="fromCountry" name="fromCountry" required placeholder="Canada" /></div>
            <div><label className="label" htmlFor="fromCity">From city</label><input className="field" id="fromCity" name="fromCity" required placeholder="Montreal" /></div>
            <div><label className="label" htmlFor="toCountry">To country</label><input className="field" id="toCountry" name="toCountry" required placeholder="Lebanon" /></div>
            <div><label className="label" htmlFor="toCity">To city</label><input className="field" id="toCity" name="toCity" required placeholder="Beirut" /></div>
            <div><label className="label" htmlFor="departure">Departure date</label><input className="field" id="departure" name="departure" type="date" min={today} required /></div>
            <div><label className="label" htmlFor="arrival">Arrival date</label><input className="field" id="arrival" name="arrival" type="date" min={today} required /></div>
          </FormSection>
          <FormSection title="Space and restrictions">
            <div><label className="label" htmlFor="space">Available luggage space</label><input className="field" id="space" name="space" required placeholder="3 kg in checked luggage" /></div>
            <div><label className="label" htmlFor="weight">Maximum item weight kg</label><input className="field" id="weight" name="weight" type="number" min="0.1" step="0.1" required placeholder="3" /></div>
            <div><label className="label" htmlFor="accepted">Accepted item types</label><input className="field" id="accepted" name="accepted" required placeholder="Documents, gifts, clothing" /></div>
            <div><label className="label" htmlFor="notAccepted">Items not accepted</label><input className="field" id="notAccepted" name="notAccepted" required placeholder="Liquids, medicine, batteries" /></div>
          </FormSection>
          <FormSection title="Compensation and meeting">
            <div><label className="label" htmlFor="compensation">Expected compensation</label><input className="field" id="compensation" name="compensation" required placeholder="$35-70 CAD" /></div>
            <div><label className="label" htmlFor="meeting">Meeting preferences</label><input className="field" id="meeting" name="meeting" required placeholder="Downtown Montreal or YUL" /></div>
            <div className="md:col-span-2"><label className="label" htmlFor="notes">Notes</label><textarea className="field min-h-28" id="notes" name="notes" placeholder="Add inspection, handoff, or route context." /></div>
          </FormSection>
          {/* Future Supabase integration: insert trip and notify matching requesters. */}
          <button className="rounded-lg bg-trust px-5 py-3 text-sm font-semibold text-white hover:bg-ink" type="submit">Post trip</button>
        </form>
      </section>
    </>
  );
}
