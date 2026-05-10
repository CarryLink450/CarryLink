import { deliveryRequests, trips } from "@/data/mockData";
import type { DeliveryRequest, Match, MatchStrength, Trip, User } from "@/types";

const day = 24 * 60 * 60 * 1000;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function dateDistanceFromRange(date: string, start: string, end: string) {
  const d = new Date(date).getTime();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (d >= s && d <= e) return 0;
  return Math.min(Math.abs(d - s), Math.abs(d - e)) / day;
}

export function scoreTripForRequest(trip: Trip, request: DeliveryRequest) {
  let score = 0;
  if (normalize(trip.fromCountry) === normalize(request.fromCountry)) score += 24;
  if (normalize(trip.fromCity) === normalize(request.fromCity)) score += 16;
  if (normalize(trip.toCountry) === normalize(request.toCountry)) score += 24;
  if (normalize(trip.toCity) === normalize(request.toCity)) score += 16;

  const dateDistance = dateDistanceFromRange(
    trip.departureDate,
    request.preferredStartDate,
    request.preferredEndDate
  );
  if (dateDistance === 0) score += 16;
  else if (dateDistance <= 3) score += 10;
  else if (dateDistance <= 7) score += 5;

  if (trip.maxItemWeightKg >= request.approximateWeightKg) score += 4;

  return Math.min(score, 100);
}

export function strengthFromScore(score: number): MatchStrength {
  if (score >= 80) return "Strong Match";
  if (score >= 55) return "Good Match";
  return "Possible Match";
}

export function getMatches(): Match[] {
  return getMatchesForData(trips, deliveryRequests);
}

export function tripTouchesUserCountries(trip: Trip, user?: Pick<User, "currentCountry" | "homeCountry"> | null) {
  if (!user) return true;

  const countries = [user.currentCountry, user.homeCountry]
    .map((country) => normalize(country))
    .filter(Boolean);

  if (!countries.length) return true;

  return countries.includes(normalize(trip.fromCountry)) || countries.includes(normalize(trip.toCountry));
}

export function filterTripsForUserCountries(tripList: Trip[], user?: Pick<User, "currentCountry" | "homeCountry"> | null) {
  return tripList.filter((trip) => tripTouchesUserCountries(trip, user));
}

function includesQuery(value: string, query: string) {
  return normalize(value).includes(normalize(query));
}

function dateIsDuringTrip(date: string, trip: Pick<Trip, "departureDate" | "arrivalDate">) {
  const selectedDate = new Date(`${date}T00:00:00`).getTime();
  const departureDate = new Date(`${trip.departureDate}T00:00:00`).getTime();
  const arrivalDate = new Date(`${trip.arrivalDate}T00:00:00`).getTime();

  if ([selectedDate, departureDate, arrivalDate].some(Number.isNaN)) return true;

  return selectedDate >= departureDate && selectedDate <= arrivalDate;
}

export function filterTripsBySearch(
  tripList: Trip[],
  filters: {
    from?: string;
    to?: string;
    date?: string;
  }
) {
  const from = filters.from?.trim();
  const to = filters.to?.trim();
  const date = filters.date?.trim();

  return tripList.filter((trip) => {
    const fromMatch = from
      ? includesQuery(trip.fromCountry, from) || includesQuery(trip.fromCity, from)
      : true;
    const toMatch = to
      ? includesQuery(trip.toCountry, to) || includesQuery(trip.toCity, to)
      : true;
    const dateMatch = date ? dateIsDuringTrip(date, trip) : true;

    return fromMatch && toMatch && dateMatch;
  });
}

export function getMatchesForData(tripList: Trip[], requestList: DeliveryRequest[]): Match[] {
  return tripList
    .flatMap((trip) =>
      requestList.map((request) => {
        const score = scoreTripForRequest(trip, request);
        return {
          id: `m-${trip.id}-${request.id}`,
          tripId: trip.id,
          requestId: request.id,
          score,
          strength: strengthFromScore(score)
        };
      })
    )
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score);
}

export function getTravelerMatches(requestId = deliveryRequests[0].id) {
  const request = deliveryRequests.find((item) => item.id === requestId) ?? deliveryRequests[0];
  return getTravelerMatchesForData(trips, request);
}

export function getTravelerMatchesForData(tripList: Trip[], request: DeliveryRequest) {
  return tripList
    .map((trip) => ({
      trip,
      score: scoreTripForRequest(trip, request),
      strength: strengthFromScore(scoreTripForRequest(trip, request))
    }))
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score);
}

export function getRequestMatches(tripId = trips[0].id) {
  const trip = trips.find((item) => item.id === tripId) ?? trips[0];
  return getRequestMatchesForData(deliveryRequests, trip);
}

export function getRequestMatchesForData(requestList: DeliveryRequest[], trip: Trip) {
  return requestList
    .map((request) => ({
      request,
      score: scoreTripForRequest(trip, request),
      strength: strengthFromScore(scoreTripForRequest(trip, request))
    }))
    .filter((match) => match.score >= 35)
    .sort((a, b) => b.score - a.score);
}
