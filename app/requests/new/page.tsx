import { FormSection } from "@/components/FormSection";
import { PageHeader } from "@/components/PageHeader";
import { SafetyNotice } from "@/components/SafetyNotice";
import { createDeliveryRequestAction } from "@/app/actions";

export default async function CreateRequestPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <>
      <PageHeader title="Create delivery request" description="Describe what you need sent so matching travelers can evaluate route, timing, size, and safety fit." />
      <section className="section max-w-5xl">
        <form action={createDeliveryRequestAction} className="grid gap-6">
          {params.error ? (
            <p className="rounded-lg bg-coral/10 p-4 text-sm font-medium text-coral">
              Request was not saved: {params.error}
            </p>
          ) : null}
          <SafetyNotice />
          <FormSection title="Route and timing">
            <div><label className="label" htmlFor="fromCountry">From country</label><input className="field" id="fromCountry" name="fromCountry" required placeholder="Canada" /></div>
            <div><label className="label" htmlFor="fromCity">From city</label><input className="field" id="fromCity" name="fromCity" required placeholder="Montreal" /></div>
            <div><label className="label" htmlFor="toCountry">To country</label><input className="field" id="toCountry" name="toCountry" required placeholder="Lebanon" /></div>
            <div><label className="label" htmlFor="toCity">To city</label><input className="field" id="toCity" name="toCity" required placeholder="Beirut" /></div>
            <div><label className="label" htmlFor="startDate">Preferred start date</label><input className="field" id="startDate" name="startDate" type="date" required /></div>
            <div><label className="label" htmlFor="endDate">Preferred end date</label><input className="field" id="endDate" name="endDate" type="date" required /></div>
          </FormSection>
          <FormSection title="Item details">
            <div><label className="label" htmlFor="category">Item category</label><select className="field" id="category" name="category" required><option>Documents</option><option>Gift</option><option>Clothing</option><option>Small electronics</option><option>Other permitted item</option></select></div>
            <div><label className="label" htmlFor="size">Approximate size</label><input className="field" id="size" name="size" required placeholder="Envelope, shoebox, small pouch" /></div>
            <div><label className="label" htmlFor="weight">Approximate weight kg</label><input className="field" id="weight" name="weight" type="number" min="0.1" step="0.1" required placeholder="0.7" /></div>
            <div><label className="label" htmlFor="sealed">Is the item sealed?</label><select className="field" id="sealed" name="sealed" required><option>No</option><option>Yes</option></select></div>
            <div className="md:col-span-2"><label className="label" htmlFor="description">Item description</label><textarea className="field min-h-28" id="description" name="description" required placeholder="Describe the item accurately. Do not hide or omit contents." /></div>
          </FormSection>
          <FormSection title="Agreement details">
            <div><label className="label" htmlFor="compensation">Offered compensation</label><input className="field" id="compensation" name="compensation" required placeholder="$55 CAD" /></div>
            <div><label className="label" htmlFor="pickup">Pickup flexibility</label><input className="field" id="pickup" name="pickup" required placeholder="Evenings in Montreal or near YUL" /></div>
            <div className="md:col-span-2"><label className="label" htmlFor="delivery">Delivery flexibility</label><input className="field" id="delivery" name="delivery" required placeholder="Family can pick up within 48 hours" /></div>
            <label className="flex gap-3 rounded-lg border border-coral/30 bg-coral/5 p-4 text-sm text-slate-700 md:col-span-2">
              <input className="mt-1 h-4 w-4 accent-trust" name="legalConfirmation" type="checkbox" required />
              <span>I confirm this item is legal, permitted by airline/customs rules, and accurately described.</span>
            </label>
          </FormSection>
          {/* Future Supabase integration: insert delivery request and run server-side matching. */}
          <button className="rounded-lg bg-trust px-5 py-3 text-sm font-semibold text-white hover:bg-ink" type="submit">Create request</button>
        </form>
      </section>
    </>
  );
}
