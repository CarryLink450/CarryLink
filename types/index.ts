export type UserType = "Sender" | "Traveler" | "Both";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentCountry: string;
  homeCountry: string;
  userType: UserType;
  avatarInitials: string;
  verified: boolean;
}

export interface Trip {
  id: string;
  travelerId: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  departureDate: string;
  arrivalDate: string;
  availableSpace: string;
  maxItemWeightKg: number;
  acceptedItemTypes: string[];
  itemsNotAccepted: string[];
  expectedCompensation: string;
  meetingPreferences: string;
  notes: string;
  status?: string;
}

export interface DeliveryRequest {
  id: string;
  senderId: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  preferredStartDate: string;
  preferredEndDate: string;
  itemCategory: string;
  itemDescription: string;
  approximateSize: string;
  approximateWeightKg: number;
  isSealed: boolean;
  offeredCompensation: string;
  pickupFlexibility: string;
  deliveryFlexibility: string;
  legalConfirmation: boolean;
}

export type MatchStrength = "Strong Match" | "Good Match" | "Possible Match";

export interface Match {
  id: string;
  tripId: string;
  requestId: string;
  strength: MatchStrength;
  score: number;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  subject: string;
  lastMessageAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
}
