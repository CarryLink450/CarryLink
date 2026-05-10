import { AdSlot } from "@/components/AdSlot";
import { PageHeader } from "@/components/PageHeader";
import { RequestCard } from "@/components/RequestCard";
import { TripCard } from "@/components/TripCard";
import { getAppData, getCurrentAccount } from "@/lib/data";
import { getMatchesForData } from "@/lib/matching";

export default async function MatchesPage() {
  const { deliveryRequests, trips, users } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const currentProfileId = currentAccount?.profile?.id;
  const matches = getMatchesForData(trips, deliveryRequests);
  return (
    <>
      <PageHeader title="Matches" description="A ranked list based on route similarity, destination fit, date range, and item weight." />
      <section className="section">
        <AdSlot slot="9999999999" format="horizontal" className="mb-6" />
        <div className="grid gap-6">
          {matches.map((match) => {
            const trip = trips.find((item) => item.id === match.tripId)!;
            const request = deliveryRequests.find((item) => item.id === match.requestId)!;
            return (
              <div id={match.id} key={match.id} className="scroll-mt-24 grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft lg:grid-cols-2">
                <TripCard trip={trip} traveler={users.find((user) => user.id === trip.travelerId)} currentProfileId={currentProfileId} strength={match.strength} />
                <RequestCard request={request} sender={users.find((user) => user.id === request.senderId)} currentProfileId={currentProfileId} strength={match.strength} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
