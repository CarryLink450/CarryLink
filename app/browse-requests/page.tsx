import { AdSlot } from "@/components/AdSlot";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHeader } from "@/components/PageHeader";
import { RequestCard } from "@/components/RequestCard";
import { getAppData, getCurrentAccount } from "@/lib/data";
import { getRequestMatchesForData } from "@/lib/matching";

export default async function BrowseRequestsPage() {
  const { deliveryRequests, trips, users } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const currentProfileId = currentAccount?.profile?.id;
  const matched = trips[0] ? getRequestMatchesForData(deliveryRequests, trips[0]) : [];
  return (
    <>
      <PageHeader title="Browse delivery requests" description="Travelers can review requests that fit their route, dates, luggage space, and restrictions." actions={<ButtonLink href="/trips/new">Post Trip</ButtonLink>} />
      <section className="section">
        <AdSlot slot="6666666666" format="horizontal" className="mb-6" />
        <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-4">
          <input className="field" placeholder="From country or city" />
          <input className="field" placeholder="To country or city" />
          <select className="field" defaultValue=""><option value="">Any item type</option><option>Documents</option><option>Gift</option><option>Clothing</option></select>
          <button className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white">Search</button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="grid gap-5 xl:grid-cols-2">
            {matched.length
              ? matched.map(({ request, strength }) => <RequestCard key={request.id} request={request} sender={users.find((user) => user.id === request.senderId)} currentProfileId={currentProfileId} strength={strength} />)
              : deliveryRequests.map((request) => <RequestCard key={request.id} request={request} sender={users.find((user) => user.id === request.senderId)} currentProfileId={currentProfileId} />)}
          </div>
          <div className="grid content-start gap-5">
            <AdSlot slot="7777777777" format="rectangle" />
            <AdSlot slot="8888888888" format="vertical" className="hidden lg:block" />
          </div>
        </div>
      </section>
    </>
  );
}
