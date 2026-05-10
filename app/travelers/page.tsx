import { AdSlot } from "@/components/AdSlot";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHeader } from "@/components/PageHeader";
import { TripCard } from "@/components/TripCard";
import { getAppData, getCurrentAccount } from "@/lib/data";
import { filterTripsBySearch, filterTripsForUserCountries, getTravelerMatchesForData } from "@/lib/matching";

export default async function BrowseTravelersPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}) {
  const params = await searchParams;
  const filters = {
    from: params.from?.trim() ?? "",
    to: params.to?.trim() ?? "",
    date: params.date?.trim() ?? ""
  };
  const { deliveryRequests, trips, users } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const currentProfileId = currentAccount?.profile?.id;
  const hasSearch = Boolean(filters.from || filters.to || filters.date);
  const defaultTrips = filterTripsForUserCountries(trips, currentAccount?.profile);
  const baseTrips = hasSearch ? trips : defaultTrips;
  const visibleTrips = filterTripsBySearch(baseTrips, filters);
  const matched = deliveryRequests[0] && !hasSearch ? getTravelerMatchesForData(visibleTrips, deliveryRequests[0]) : [];
  const displayTrips = matched.length ? matched.map(({ trip }) => trip) : visibleTrips;
  return (
    <>
      <PageHeader title="Browse travelers" description="Find travelers with similar origin, destination, and dates." actions={<ButtonLink href="/requests/new">Create Delivery Request</ButtonLink>} />
      <section className="section">
        <AdSlot slot="3333333333" format="horizontal" className="mb-6" />
        <form action="/travelers" method="get" className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_1fr_1fr_auto]">
          <input suppressHydrationWarning className="field" name="from" placeholder="From country or city" defaultValue={filters.from} />
          <input suppressHydrationWarning className="field" name="to" placeholder="To country or city" defaultValue={filters.to} />
          <input suppressHydrationWarning className="field" name="date" type="date" defaultValue={filters.date} />
          <div className="flex gap-2">
            <button suppressHydrationWarning type="submit" className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white">Search</button>
            {hasSearch ? (
              <ButtonLink href="/travelers" variant="secondary">Reset</ButtonLink>
            ) : null}
          </div>
        </form>
        <p className="mb-4 text-sm text-slate-500">
          Showing {displayTrips.length} traveler {displayTrips.length === 1 ? "trip" : "trips"}{hasSearch ? " matching your search." : " suggested from your current and home countries."}
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="grid gap-5 xl:grid-cols-2">
            {displayTrips.length ? displayTrips.map((trip) => {
              const match = matched.find((item) => item.trip.id === trip.id);
              return <TripCard key={trip.id} trip={trip} traveler={users.find((user) => user.id === trip.travelerId)} currentProfileId={currentProfileId} strength={match?.strength} />;
            }) : (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">No travelers found for this search.</p>
            )}
          </div>
          <div className="grid content-start gap-5">
            <AdSlot slot="4444444444" format="rectangle" />
            <AdSlot slot="5555555555" format="vertical" className="hidden lg:block" />
          </div>
        </div>
      </section>
    </>
  );
}
