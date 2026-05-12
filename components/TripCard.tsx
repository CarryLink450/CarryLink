import { CalendarDays, Luggage, MapPin, MessageCircle } from "lucide-react";
import { findUser, formatDate } from "@/lib/utils";
import type { MatchStrength, Trip, User } from "@/types";
import { ButtonLink } from "./ButtonLink";
import { MatchBadge } from "./MatchBadge";

export function TripCard({
  trip,
  strength,
  traveler,
  currentProfileId,
  hasNewMessage,
  messagesHref
}: {
  trip: Trip;
  strength?: MatchStrength;
  traveler?: User;
  currentProfileId?: string;
  hasNewMessage?: boolean;
  messagesHref?: string;
}) {
  const travelerProfile = traveler ?? findUser(trip.travelerId);
  const isOwnTrip = currentProfileId === trip.travelerId;
  const chatHref = messagesHref ?? (isOwnTrip ? "/chat" : `/chat?trip=${trip.id}&recipient=${trip.travelerId}`);
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium text-slate-500">{travelerProfile.fullName}</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">
            {trip.fromCity} to {trip.toCity}
          </h2>
        </div>
        <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:flex-col sm:items-end">
          {hasNewMessage ? <span className="rounded-full bg-coral px-2.5 py-1 text-xs font-semibold text-white">New message</span> : null}
          {strength ? <MatchBadge strength={strength} /> : null}
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600">
        <p className="flex min-w-0 gap-2"><MapPin size={17} className="shrink-0 text-trust" aria-hidden /> <span className="min-w-0 break-words">{trip.fromCountry} to {trip.toCountry}</span></p>
        <p className="flex min-w-0 gap-2"><CalendarDays size={17} className="shrink-0 text-trust" aria-hidden /> <span className="min-w-0 break-words">{formatDate(trip.departureDate)} - {formatDate(trip.arrivalDate)}</span></p>
        <p className="flex min-w-0 gap-2"><Luggage size={17} className="shrink-0 text-trust" aria-hidden /> <span className="min-w-0 break-words">{trip.availableSpace}</span></p>
      </div>
      <p className="mt-4 text-sm text-slate-600">Accepts: {trip.acceptedItemTypes.join(", ")}</p>
      <p className="mt-2 text-sm font-semibold text-ink">{trip.expectedCompensation}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <ButtonLink href={`/trips/${trip.id}`} variant="outline">View Details</ButtonLink>
        <ButtonLink href={chatHref} variant="primary"><MessageCircle size={16} className="mr-2" /> {isOwnTrip ? "View Messages" : "Send Message"}</ButtonLink>
      </div>
    </article>
  );
}
