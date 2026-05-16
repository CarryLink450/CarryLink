import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHeader } from "@/components/PageHeader";
import { SafetyNotice } from "@/components/SafetyNotice";
import { getAppData, getCurrentAccount } from "@/lib/data";
import { findUserFromList, formatDate } from "@/lib/utils";

export default async function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { trips, users } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const trip = trips.find((item) => item.id === id);
  if (!trip) notFound();
  const traveler = findUserFromList(trip.travelerId, users);
  const isOwnTrip = currentAccount?.profile?.id === trip.travelerId;
  const chatHref = isOwnTrip ? "/chat" : `/chat?trip=${trip.id}&recipient=${trip.travelerId}`;

  return (
    <>
      <PageHeader title={`${trip.fromCity} to ${trip.toCity}`} description={`Posted by ${traveler.fullName}`} actions={<ButtonLink href={chatHref}>{isOwnTrip ? "View Messages" : "Message traveler"}</ButtonLink>} />
      <section className="section grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="Route" value={`${trip.fromCity}, ${trip.fromCountry} to ${trip.toCity}, ${trip.toCountry}`} />
            <Detail label="Dates" value={`${formatDate(trip.departureDate)} - ${formatDate(trip.arrivalDate)}`} />
            <Detail label="Available space" value={trip.availableSpace} />
            <Detail label="Maximum weight" value={`${trip.maxItemWeightKg} kg`} />
            <Detail label="Accepted item types" value={trip.acceptedItemTypes.join(", ")} />
            <Detail label="Items not accepted" value={trip.itemsNotAccepted.join(", ")} />
            <Detail label="Expected compensation" value={trip.expectedCompensation} />
            <Detail label="Meeting preferences" value={trip.meetingPreferences} />
          </dl>
          <p className="mt-6 leading-7 text-slate-600">{trip.notes}</p>
        </div>
        <div className="grid content-start gap-5">
          <SafetyNotice />
        </div>
      </section>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm font-semibold text-slate-500">{label}</dt><dd className="mt-1 text-ink">{value}</dd></div>;
}
