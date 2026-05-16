import { ArrowRight, CheckCircle2, Handshake, Plane, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { TripCard } from "@/components/TripCard";
import { getAppData, getCurrentAccount } from "@/lib/data";
import { filterTripsForUserCountries } from "@/lib/matching";
import { brandName } from "@/lib/utils";

const steps = [
  {
    title: "Post a need or trip",
    text: "Senders describe the item and route. Travelers list dates, space, accepted items, and handoff preferences.",
    icon: Plane,
    className: "border-trust/15 bg-skywash"
  },
  {
    title: "Review trusted matches",
    text: "Matching ranks routes and dates so users can quickly spot strong fit opportunities.",
    icon: Handshake,
    className: "border-wheat bg-wheat/70"
  },
  {
    title: "Chat and agree",
    text: "Both sides confirm item details, compensation, handoff location, delivery location, and safety expectations.",
    icon: CheckCircle2,
    className: "border-coral/15 bg-coral/5"
  }
];

const routes = ["Montreal to Beirut", "Beirut to Montreal", "Paris to Dakar", "Toronto to Singapore", "Dubai to Manila", "London to Accra"];

export default async function HomePage() {
  const { conversations, messages, trips, users } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const currentProfileId = currentAccount?.profile?.id;
  const personalizedTrips = filterTripsForUserCountries(trips, currentAccount?.profile);
  const suggestedTrips = (personalizedTrips.length ? personalizedTrips : trips).slice(0, 3);

  function getTripConversation(tripId: string, fromCity: string, toCity: string) {
    if (!currentProfileId) return null;

    const tripRoute = `${fromCity} to ${toCity}`.toLowerCase();

    return (
      conversations.find((conversation) => {
        const latest = messages
          .filter((message) => message.conversationId === conversation.id)
          .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
          .at(-1);

        return (
          conversation.participantIds.includes(currentProfileId) &&
          (conversation.subject.toLowerCase().includes(tripRoute) || conversation.subject.includes(tripId)) &&
          latest &&
          latest.senderId !== currentProfileId
        );
      }) ?? null
    );
  }

  return (
    <>
      <section className="bg-white">
        <div className="section">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-trust">Peer travel delivery for diaspora communities</p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-ink sm:text-6xl">
                Send items with trusted travelers between your country and home.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                {brandName} helps senders find people already traveling the same route, then coordinate small documents, gifts, and packages with clear safety expectations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/travelers">Find a Traveler <ArrowRight size={16} className="ml-2" /></ButtonLink>
                <ButtonLink href="/trips/new" variant="secondary">Post a Trip</ButtonLink>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-skywash shadow-soft">
              <Image
                src="/images/carrylink-hero.png"
                alt="Traveler and sender coordinating a small international delivery at an airport"
                width={1200}
                height={900}
                priority
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>
          </div>

          {suggestedTrips.length ? (
            <div className="mt-10">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-trust">Suggested posted trips</p>
                  <h2 className="mt-1 text-2xl font-semibold text-ink">Travelers on relevant routes</h2>
                </div>
                <ButtonLink href="/travelers" variant="outline">View all</ButtonLink>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {suggestedTrips.map((trip) => {
                  const traveler = users.find((user) => user.id === trip.travelerId);
                  const conversation = getTripConversation(trip.id, trip.fromCity, trip.toCity);

                  return (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      traveler={traveler}
                      currentProfileId={currentProfileId}
                      hasNewMessage={Boolean(conversation)}
                      messagesHref={conversation ? `/chat?conversation=${conversation.id}` : undefined}
                      strength="Strong Match"
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.title} className={`rounded-lg border p-5 shadow-soft ${step.className}`}>
              <step.icon className="text-trust" size={26} aria-hidden />
              <h2 className="mt-4 text-lg font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-skywash">
        <div className="section grid gap-8 lg:grid-cols-2">
          <article className="rounded-lg bg-trust p-6 text-white shadow-soft">
            <h2 className="text-2xl font-semibold">For Senders</h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/85">Create a delivery request, compare route matches, and message travelers who fit your timeline.</p>
          </article>
          <article className="rounded-lg bg-coral p-6 text-white shadow-soft">
            <h2 className="text-2xl font-semibold">For Travelers</h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/85">Post available luggage space, set item restrictions, and receive requests that match your itinerary.</p>
          </article>
        </div>
      </section>

      <section className="section grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <ShieldCheck className="text-coral" size={30} aria-hidden />
          <h2 className="mt-4 text-3xl font-semibold text-ink">Safety comes first</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Users must avoid prohibited, illegal, dangerous, restricted, or undeclared items and follow airline, customs, and destination-country laws.
          </p>
          <div className="mt-5">
            <ButtonLink href="/safety" variant="secondary">Read Safety Guidelines</ButtonLink>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {routes.map((route) => (
            <div key={route} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-ink shadow-soft">
              {route}
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
