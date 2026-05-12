import type { Conversation, DeliveryRequest, Message, Trip, User } from "@/types";

export const users: User[] = [];

export const trips: Trip[] = [
  {
    id: "t-mtl-beirut-1",
    travelerId: "u-karim",
    fromCountry: "Canada",
    fromCity: "Montreal",
    toCountry: "Lebanon",
    toCity: "Beirut",
    departureDate: "2026-05-18",
    arrivalDate: "2026-05-19",
    availableSpace: "Small backpack pocket and 3 kg in checked luggage",
    maxItemWeightKg: 3,
    acceptedItemTypes: ["Documents", "Gifts", "Clothing", "Small electronics"],
    itemsNotAccepted: ["Liquids", "Medicine", "Cash", "Batteries"],
    expectedCompensation: "$35-70 CAD",
    meetingPreferences: "Meet in downtown Montreal or at YUL before security.",
    notes: "Prefer unsealed items I can inspect with the sender."
  },
  {
    id: "t-beirut-mtl-1",
    travelerId: "u-nour",
    fromCountry: "Lebanon",
    fromCity: "Beirut",
    toCountry: "Canada",
    toCity: "Montreal",
    departureDate: "2026-06-04",
    arrivalDate: "2026-06-05",
    availableSpace: "Half carry-on, around 5 kg",
    maxItemWeightKg: 5,
    acceptedItemTypes: ["Documents", "Packaged sweets", "Books", "Clothing"],
    itemsNotAccepted: ["Tobacco", "Alcohol", "Prescription medicine", "Fragile glass"],
    expectedCompensation: "$50 CAD or agreed equivalent",
    meetingPreferences: "Pickup in Achrafieh or airport handoff.",
    notes: "Happy to coordinate with family on both sides."
  },
  {
    id: "t-paris-dakar-1",
    travelerId: "u-amina",
    fromCountry: "France",
    fromCity: "Paris",
    toCountry: "Senegal",
    toCity: "Dakar",
    departureDate: "2026-05-28",
    arrivalDate: "2026-05-28",
    availableSpace: "2 kg in checked luggage",
    maxItemWeightKg: 2,
    acceptedItemTypes: ["Documents", "Small gifts", "Clothing"],
    itemsNotAccepted: ["Food", "Liquids", "Electronics with batteries"],
    expectedCompensation: "EUR 25-45",
    meetingPreferences: "Meet near Gare du Nord or CDG Terminal 2.",
    notes: "Items must be clearly labeled and customs-safe."
  },
  {
    id: "t-toronto-singapore-1",
    travelerId: "u-david",
    fromCountry: "Canada",
    fromCity: "Toronto",
    toCountry: "Singapore",
    toCity: "Singapore",
    departureDate: "2026-07-12",
    arrivalDate: "2026-07-14",
    availableSpace: "Document sleeve and 1 kg personal item space",
    maxItemWeightKg: 1,
    acceptedItemTypes: ["Documents", "Light accessories"],
    itemsNotAccepted: ["Food", "Medicine", "Liquids", "Power banks"],
    expectedCompensation: "$30 CAD",
    meetingPreferences: "Meet in North York or YYZ departures.",
    notes: "Best for urgent papers or very small items."
  }
];

export const deliveryRequests: DeliveryRequest[] = [
  {
    id: "r-docs-lebanon",
    senderId: "u-sara",
    fromCountry: "Canada",
    fromCity: "Montreal",
    toCountry: "Lebanon",
    toCity: "Beirut",
    preferredStartDate: "2026-05-16",
    preferredEndDate: "2026-05-23",
    itemCategory: "Documents",
    itemDescription: "University transcript envelope and a small family photo album.",
    approximateSize: "Envelope plus slim book",
    approximateWeightKg: 0.7,
    isSealed: false,
    offeredCompensation: "$55 CAD",
    pickupFlexibility: "Can meet evenings in Montreal or near YUL.",
    deliveryFlexibility: "Family can pick up in Beirut within 48 hours.",
    legalConfirmation: true
  },
  {
    id: "r-gift-mtl",
    senderId: "u-nour",
    fromCountry: "Lebanon",
    fromCity: "Beirut",
    toCountry: "Canada",
    toCity: "Montreal",
    preferredStartDate: "2026-06-01",
    preferredEndDate: "2026-06-08",
    itemCategory: "Gift",
    itemDescription: "A boxed handmade scarf and greeting card.",
    approximateSize: "Shoe box",
    approximateWeightKg: 0.9,
    isSealed: false,
    offeredCompensation: "$40 CAD",
    pickupFlexibility: "Pickup from Hamra or Achrafieh.",
    deliveryFlexibility: "Recipient can meet downtown Montreal.",
    legalConfirmation: true
  },
  {
    id: "r-paris-dakar",
    senderId: "u-amina",
    fromCountry: "France",
    fromCity: "Paris",
    toCountry: "Senegal",
    toCity: "Dakar",
    preferredStartDate: "2026-05-25",
    preferredEndDate: "2026-06-02",
    itemCategory: "Clothing",
    itemDescription: "Two folded children&apos;s outfits in a soft pouch.",
    approximateSize: "Small packing cube",
    approximateWeightKg: 1.2,
    isSealed: false,
    offeredCompensation: "EUR 30",
    pickupFlexibility: "Flexible within central Paris.",
    deliveryFlexibility: "A relative can meet in Dakar Plateau.",
    legalConfirmation: true
  }
];

export const conversations: Conversation[] = [
  {
    id: "c-sara-karim",
    participantIds: ["u-sara", "u-karim"],
    subject: "Montreal to Beirut documents",
    lastMessageAt: "2026-04-26T14:12:00Z"
  },
  {
    id: "c-nour-sara",
    participantIds: ["u-nour", "u-sara"],
    subject: "Beirut to Montreal gift",
    lastMessageAt: "2026-04-25T19:40:00Z"
  }
];

export const messages: Message[] = [
  {
    id: "m-1",
    conversationId: "c-sara-karim",
    senderId: "u-sara",
    body: "Hi Karim, your May 18 trip looks perfect for my documents. Would you be open to checking the envelope before handoff?",
    sentAt: "2026-04-26T13:52:00Z"
  },
  {
    id: "m-2",
    conversationId: "c-sara-karim",
    senderId: "u-karim",
    body: "Yes, that works. I can meet near Guy-Concordia or at YUL. Please bring ID and keep the item unsealed.",
    sentAt: "2026-04-26T14:02:00Z"
  },
  {
    id: "m-3",
    conversationId: "c-sara-karim",
    senderId: "u-sara",
    body: "Great. I can meet downtown on May 17 after work and my brother can pick up in Beirut.",
    sentAt: "2026-04-26T14:12:00Z"
  },
  {
    id: "m-4",
    conversationId: "c-nour-sara",
    senderId: "u-nour",
    body: "I posted a Beirut to Montreal request for a scarf. Do you know anyone traveling early June?",
    sentAt: "2026-04-25T19:30:00Z"
  },
  {
    id: "m-5",
    conversationId: "c-nour-sara",
    senderId: "u-sara",
    body: "I saw a trip arriving June 5. The item sounds customs-safe, so it may be a good match.",
    sentAt: "2026-04-25T19:40:00Z"
  }
];
