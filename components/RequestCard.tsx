import { CalendarDays, MapPin, Package, MessageCircle } from "lucide-react";
import { findUser, formatDate } from "@/lib/utils";
import type { DeliveryRequest, MatchStrength, User } from "@/types";
import { ButtonLink } from "./ButtonLink";
import { MatchBadge } from "./MatchBadge";

export function RequestCard({
  request,
  strength,
  sender,
  currentProfileId
}: {
  request: DeliveryRequest;
  strength?: MatchStrength;
  sender?: User;
  currentProfileId?: string;
}) {
  const senderProfile = sender ?? findUser(request.senderId);
  const isOwnRequest = currentProfileId === request.senderId;
  const chatHref = isOwnRequest ? "/chat" : `/chat?request=${request.id}&recipient=${request.senderId}`;
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium text-slate-500">{senderProfile.fullName}</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">
            {request.itemCategory}: {request.fromCity} to {request.toCity}
          </h2>
        </div>
        <div className="shrink-0">{strength ? <MatchBadge strength={strength} /> : null}</div>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600">
        <p className="flex min-w-0 gap-2"><MapPin size={17} className="shrink-0 text-trust" aria-hidden /> <span className="min-w-0 break-words">{request.fromCountry} to {request.toCountry}</span></p>
        <p className="flex min-w-0 gap-2"><CalendarDays size={17} className="shrink-0 text-trust" aria-hidden /> <span className="min-w-0 break-words">{formatDate(request.preferredStartDate)} - {formatDate(request.preferredEndDate)}</span></p>
        <p className="flex min-w-0 gap-2"><Package size={17} className="shrink-0 text-trust" aria-hidden /> <span className="min-w-0 break-words">{request.approximateSize}, {request.approximateWeightKg} kg</span></p>
      </div>
      <p className="mt-4 text-sm text-slate-600">{request.itemDescription}</p>
      <p className="mt-2 text-sm font-semibold text-ink">{request.offeredCompensation}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <ButtonLink href={`/requests/${request.id}`} variant="outline">View Details</ButtonLink>
        <ButtonLink href={chatHref} variant="primary"><MessageCircle size={16} className="mr-2" /> {isOwnRequest ? "View Messages" : "Send Message"}</ButtonLink>
      </div>
    </article>
  );
}
