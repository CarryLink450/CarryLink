import { conversations, deliveryRequests, messages, trips, users } from "@/data/mockData";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Conversation, DeliveryRequest, Message, Trip, User } from "@/types";
import { mapConversation, mapDeliveryRequest, mapMessage, mapProfile, mapTrip } from "./supabase/mappers";
import { createAuthSupabaseServerClient, createServerSupabaseClient, createServiceSupabaseClient, isSupabaseConfigured } from "./supabase/server";

type AppData = {
  users: User[];
  trips: Trip[];
  deliveryRequests: DeliveryRequest[];
  conversations: Conversation[];
  messages: Message[];
  source: "supabase" | "mock";
};

type CurrentAccount = {
  authUser: SupabaseUser;
  profile: User | null;
  displayName: string;
};

const mockData: AppData = {
  users,
  trips,
  deliveryRequests,
  conversations,
  messages,
  source: "mock"
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

async function deactivatePastTrips() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const supabase = createServiceSupabaseClient();
  await supabase
    .from("trips")
    .update({ status: "Inactive" })
    .lt("departure_date", todayIsoDate())
    .neq("status", "Inactive");
}

export async function getAppData(): Promise<AppData> {
  if (!isSupabaseConfigured()) return mockData;

  try {
    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createServiceSupabaseClient()
      : createServerSupabaseClient();
    await deactivatePastTrips();

    const [profilesResult, tripsResult, requestsResult, conversationsResult, messagesResult] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: true }),
      supabase.from("trips").select("*").in("status", ["active", "Active"]).gte("departure_date", todayIsoDate()).order("departure_date", { ascending: true }),
      supabase.from("delivery_requests").select("*").eq("status", "active").order("preferred_start_date", { ascending: true }),
      supabase.from("conversations").select("*, conversation_participants(profile_id)").order("last_message_at", { ascending: false }),
      supabase.from("messages").select("*").order("sent_at", { ascending: true })
    ]);

    if (profilesResult.error || tripsResult.error || requestsResult.error || conversationsResult.error || messagesResult.error) {
      return mockData;
    }

    return {
      users: profilesResult.data.map(mapProfile),
      trips: tripsResult.data.map(mapTrip),
      deliveryRequests: requestsResult.data.map(mapDeliveryRequest),
      conversations: conversationsResult.data.map(mapConversation),
      messages: messagesResult.data.map(mapMessage),
      source: "supabase"
    };
  } catch {
    return mockData;
  }
}

export async function getTrips() {
  return (await getAppData()).trips;
}

export async function getDeliveryRequests() {
  return (await getAppData()).deliveryRequests;
}

export async function getUsers() {
  return (await getAppData()).users;
}

export async function getCurrentProfile() {
  return (await getCurrentAccount())?.profile ?? null;
}

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const authSupabase = await createAuthSupabaseServerClient();
    const {
      data: { user }
    } = await authSupabase.auth.getUser();

    if (!user) return null;

    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createServiceSupabaseClient()
      : createServerSupabaseClient();

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    const profile = data ? mapProfile(data) : null;
    const metadataName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
    const displayName = profile?.fullName || metadataName || user.email || "Profile";

    return {
      authUser: user,
      profile,
      displayName
    };
  } catch {
    return null;
  }
}

export function findUserInList(profileId: string, list: User[]) {
  return list.find((user) => user.id === profileId) ?? list[0] ?? users[0];
}
