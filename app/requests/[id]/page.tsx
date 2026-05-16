import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHeader } from "@/components/PageHeader";
import { SafetyNotice } from "@/components/SafetyNotice";
import { getAppData, getCurrentAccount } from "@/lib/data";
import { findUserFromList, formatDate } from "@/lib/utils";

export default async function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { deliveryRequests, users } = await getAppData();
  const currentAccount = await getCurrentAccount();
  const request = deliveryRequests.find((item) => item.id === id);
  if (!request) notFound();
  const sender = findUserFromList(request.senderId, users);
  const isOwnRequest = currentAccount?.profile?.id === request.senderId;
  const chatHref = isOwnRequest ? "/chat" : `/chat?request=${request.id}&recipient=${request.senderId}`;

  return (
    <>
      <PageHeader title={`${request.itemCategory} to ${request.toCity}`} description={`Requested by ${sender.fullName}`} actions={<ButtonLink href={chatHref}>{isOwnRequest ? "View Messages" : "Message sender"}</ButtonLink>} />
      <section className="section grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="Route" value={`${request.fromCity}, ${request.fromCountry} to ${request.toCity}, ${request.toCountry}`} />
            <Detail label="Preferred dates" value={`${formatDate(request.preferredStartDate)} - ${formatDate(request.preferredEndDate)}`} />
            <Detail label="Size" value={request.approximateSize} />
            <Detail label="Weight" value={`${request.approximateWeightKg} kg`} />
            <Detail label="Sealed" value={request.isSealed ? "Yes" : "No"} />
            <Detail label="Offered compensation" value={request.offeredCompensation} />
            <Detail label="Pickup flexibility" value={request.pickupFlexibility} />
            <Detail label="Delivery flexibility" value={request.deliveryFlexibility} />
          </dl>
          <p className="mt-6 leading-7 text-slate-600">{request.itemDescription}</p>
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
