import type { Conversation, DeliveryRequest, Message, Trip, User, UserType } from "@/types";

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  current_country: string;
  home_country: string;
  user_type: UserType;
  avatar_initials: string;
  verified: boolean;
};

type TripRow = {
  id: string;
  traveler_id: string;
  from_country: string;
  from_city: string;
  to_country: string;
  to_city: string;
  departure_date: string;
  arrival_date: string;
  available_space: string;
  max_item_weight_kg: number | string;
  accepted_item_types: string[] | null;
  items_not_accepted: string[] | null;
  expected_compensation: string;
  meeting_preferences: string;
  notes: string | null;
  status?: string | null;
};

type RequestRow = {
  id: string;
  sender_id: string;
  from_country: string;
  from_city: string;
  to_country: string;
  to_city: string;
  preferred_start_date: string;
  preferred_end_date: string;
  item_category: string;
  item_description: string;
  approximate_size: string;
  approximate_weight_kg: number | string;
  is_sealed: boolean;
  offered_compensation: string;
  pickup_flexibility: string;
  delivery_flexibility: string;
  legal_confirmation: boolean;
};

type ConversationRow = {
  id: string;
  subject: string;
  last_message_at: string;
  conversation_participants?: { profile_id: string }[];
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  sent_at: string;
};

export function mapProfile(row: ProfileRow): User {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    currentCountry: row.current_country,
    homeCountry: row.home_country,
    userType: row.user_type,
    avatarInitials: row.avatar_initials,
    verified: row.verified
  };
}

export function mapTrip(row: TripRow): Trip {
  return {
    id: row.id,
    travelerId: row.traveler_id,
    fromCountry: row.from_country,
    fromCity: row.from_city,
    toCountry: row.to_country,
    toCity: row.to_city,
    departureDate: row.departure_date,
    arrivalDate: row.arrival_date,
    availableSpace: row.available_space,
    maxItemWeightKg: Number(row.max_item_weight_kg),
    acceptedItemTypes: row.accepted_item_types ?? [],
    itemsNotAccepted: row.items_not_accepted ?? [],
    expectedCompensation: row.expected_compensation,
    meetingPreferences: row.meeting_preferences,
    notes: row.notes ?? "",
    status: row.status ?? undefined
  };
}

export function mapDeliveryRequest(row: RequestRow): DeliveryRequest {
  return {
    id: row.id,
    senderId: row.sender_id,
    fromCountry: row.from_country,
    fromCity: row.from_city,
    toCountry: row.to_country,
    toCity: row.to_city,
    preferredStartDate: row.preferred_start_date,
    preferredEndDate: row.preferred_end_date,
    itemCategory: row.item_category,
    itemDescription: row.item_description,
    approximateSize: row.approximate_size,
    approximateWeightKg: Number(row.approximate_weight_kg),
    isSealed: row.is_sealed,
    offeredCompensation: row.offered_compensation,
    pickupFlexibility: row.pickup_flexibility,
    deliveryFlexibility: row.delivery_flexibility,
    legalConfirmation: row.legal_confirmation
  };
}

export function mapConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    subject: row.subject,
    lastMessageAt: row.last_message_at,
    participantIds: row.conversation_participants?.map((participant) => participant.profile_id) ?? []
  };
}

export function mapMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    body: row.body,
    sentAt: row.sent_at
  };
}
