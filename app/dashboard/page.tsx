import { MessageCircle, Package, Plane, Sparkles } from "lucide-react";
import Link from "next/link";
import { MatchBadge } from "@/components/MatchBadge";
import { PageHeader } from "@/components/PageHeader";
import { RequestCard } from "@/components/RequestCard";
import { StatCard } from "@/components/StatCard";
import { TripCard } from "@/components/TripCard";
import { getAppData, getCurrentAccount } from "@/lib/data";
import { getMatchesForData } from "@/lib/matching";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const params = await searchParams;
  const { conversations, deliveryRequests, messages, trips, users, source } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const displayName = currentAccount?.displayName.split(" ")[0] ?? "there";
  const currentProfileId = currentAccount?.profile?.id;
  const myTrips = currentProfileId ? trips.filter((trip) => trip.travelerId === currentProfileId) : [];
  const myRequests = currentProfileId ? deliveryRequests.filter((request) => request.senderId === currentProfileId) : [];
  const myConversations = currentProfileId
    ? conversations.filter((conversation) => conversation.participantIds.includes(currentProfileId))
    : [];
  const matches = getMatchesForData(trips, deliveryRequests);
  const myMatches = matches.filter((match) => {
    const trip = trips.find((item) => item.id === match.tripId);
    const request = deliveryRequests.find((item) => item.id === match.requestId);
    return trip?.travelerId === currentProfileId || request?.senderId === currentProfileId;
  });
  const newMessageByTripId = new Map<string, string>();
  for (const trip of myTrips) {
    const routeLabel = `${trip.fromCity} to ${trip.toCity}`.toLowerCase();
    const relatedConversation = myConversations.find((conversation) => {
      const latest = messages
        .filter((message) => message.conversationId === conversation.id)
        .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
        .at(-1);

      return (
        conversation.subject.toLowerCase().includes(routeLabel) &&
        latest &&
        latest.senderId !== currentProfileId
      );
    });

    if (relatedConversation) {
      newMessageByTripId.set(trip.id, `/chat?conversation=${relatedConversation.id}`);
    }
  }
  const tripsWithNewMessages = myTrips.filter((trip) => newMessageByTripId.has(trip.id));
  return (
    <>
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${displayName}`} description={`A practical view of your active requests, posted trips, matches, and conversations. Data source: ${source}.`} />
      <section className="section">
        {params.created === "trip" ? <p className="mb-5 rounded-lg bg-skywash p-4 text-sm font-semibold text-trust">Trip saved successfully.</p> : null}
        {params.created === "request" ? <p className="mb-5 rounded-lg bg-skywash p-4 text-sm font-semibold text-trust">Delivery request saved successfully.</p> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active delivery requests" value={String(myRequests.length)} />
          <StatCard label="Posted trips" value={String(myTrips.length)} />
          <Link href="/matches" className="block rounded-lg transition hover:-translate-y-0.5 hover:shadow-soft">
            <StatCard label="Open matches" value={String(myMatches.length)} />
          </Link>
          <StatCard label="Conversations" value={String(myConversations.length)} />
        </div>
        {tripsWithNewMessages.length ? (
          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink"><MessageCircle size={20} /> Trips with new messages</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {tripsWithNewMessages.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  traveler={users.find((user) => user.id === trip.travelerId)}
                  currentProfileId={currentProfileId}
                  hasNewMessage
                  messagesHref={newMessageByTripId.get(trip.id)}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink"><Package size={20} /> My active delivery requests</h2>
            <div className="grid gap-4">
              {myRequests.length ? myRequests.map((request) => <RequestCard key={request.id} request={request} sender={users.find((user) => user.id === request.senderId)} currentProfileId={currentProfileId} />) : <EmptyState text="No delivery requests yet." />}
            </div>
          </div>
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-ink"><Plane size={20} /> My posted trips</h2>
            <div className="grid gap-4">
              {myTrips.length ? myTrips.map((trip) => <TripCard key={trip.id} trip={trip} traveler={users.find((user) => user.id === trip.travelerId)} currentProfileId={currentProfileId} hasNewMessage={newMessageByTripId.has(trip.id)} messagesHref={newMessageByTripId.get(trip.id)} />) : <EmptyState text="No posted trips yet." />}
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-ink"><Sparkles size={20} /> My matches</h2>
            <div className="mt-4 grid gap-3">
              {myMatches.length ? myMatches.slice(0, 4).map((match) => {
                const trip = trips.find((item) => item.id === match.tripId);
                const request = deliveryRequests.find((item) => item.id === match.requestId);

                if (!trip || !request) return null;

                return (
                  <Link key={match.id} href={`/matches#${match.id}`} className="block rounded-lg bg-slate-50 p-3 text-sm text-slate-700 transition hover:bg-skywash">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-ink">{trip.fromCity} to {trip.toCity}</span>
                      <MatchBadge strength={match.strength} />
                    </span>
                    <span className="mt-2 block text-xs text-slate-500">
                      Request: {request.itemCategory} - score {match.score}
                    </span>
                  </Link>
                );
              }) : <EmptyState text="No matches yet." />}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-ink"><MessageCircle size={20} /> My conversations</h2>
            <div className="mt-4 grid gap-3">
              {myConversations.length ? myConversations.map((conversation) => {
                const latest = messages.filter((message) => message.conversationId === conversation.id).at(-1);
                const hasNewReply = latest ? latest.senderId !== currentProfileId : false;
                return (
                  <Link key={conversation.id} href={`/chat?conversation=${conversation.id}`} className="block rounded-lg bg-slate-50 p-3 text-sm font-medium text-slate-700 hover:bg-skywash">
                    <span className="flex items-center justify-between gap-3">
                      <span>{conversation.subject}</span>
                      {hasNewReply ? <span className="rounded-full bg-coral px-2 py-0.5 text-[11px] font-semibold text-white">New reply</span> : null}
                    </span>
                    {latest ? <span className="mt-1 block truncate text-xs font-normal text-slate-500">{latest.body}</span> : null}
                  </Link>
                );
              }) : <EmptyState text="No conversations yet." />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">{text}</p>;
}
