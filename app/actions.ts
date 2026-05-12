"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthSupabaseServerClient, createServiceSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

function requireValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function phoneForSupabaseAuth(phone: string) {
  const compact = phone.replace(/[\s().-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : undefined;
}

async function findAuthUserByEmail(email: string) {
  const serviceSupabase = createServiceSupabaseClient();
  const targetEmail = email.toLowerCase();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await serviceSupabase.auth.admin.listUsers({
      page,
      perPage: 1000
    });

    if (error) return null;

    const user = data.users.find((item) => item.email?.toLowerCase() === targetEmail);
    if (user) return user;
    if (data.users.length < 1000) return null;

    page += 1;
  }

  return null;
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, "-").replace(/-+/g, "-");
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function dateTime(value: string) {
  return new Date(`${value}T00:00:00`).getTime();
}

async function upsertProfileForAuthUser({
  authUserId,
  currentCountry,
  email,
  fullName,
  homeCountry,
  phone,
  userType
}: {
  authUserId: string;
  currentCountry: string;
  email: string;
  fullName: string;
  homeCountry: string;
  phone: string;
  userType: string;
}) {
  const serviceSupabase = createServiceSupabaseClient();

  return serviceSupabase.from("profiles").upsert({
    auth_user_id: authUserId,
    full_name: fullName,
    email,
    phone,
    current_country: currentCountry,
    home_country: homeCountry,
    user_type: userType,
    avatar_initials: initials(fullName),
    verified: false
  }, { onConflict: "auth_user_id" });
}

async function requireCurrentProfileId() {
  const authSupabase = await createAuthSupabaseServerClient();
  const { data: authData } = await authSupabase.auth.getUser();
  if (!authData.user) redirect("/login");

  const supabase = createServiceSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!profile) redirect("/profile");
  return profile.id as string;
}

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createAuthSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: requireValue(formData, "email"),
    password: requireValue(formData, "password")
  });

  if (error) {
    const reason = error.message.toLowerCase().includes("confirm") ? "email_not_confirmed" : "invalid_credentials";
    redirect(`/login?error=${reason}`);
  }

  const next = String(formData.get("next") ?? "/dashboard");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signupAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/signup");

  const email = requireValue(formData, "email");
  const password = requireValue(formData, "password");
  const fullName = requireValue(formData, "fullName");
  const phone = requireValue(formData, "phone");
  const currentCountry = requireValue(formData, "currentCountry");
  const homeCountry = requireValue(formData, "homeCountry");
  const userType = requireValue(formData, "userType");

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = await createAuthSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          current_country: currentCountry,
          home_country: homeCountry,
          user_type: userType
        }
      }
    });

    if (error || !data.user) redirect("/signup?error=signup_failed");
    redirect(data.session ? "/dashboard" : "/login?message=check_email");
  }

  const serviceSupabase = createServiceSupabaseClient();
  const authPhone = phoneForSupabaseAuth(phone);
  const { data: createdUser, error: createUserError } = await serviceSupabase.auth.admin.createUser({
    email,
    password,
    ...(authPhone ? { phone: authPhone, phone_confirm: true } : {}),
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      phone,
      current_country: currentCountry,
      home_country: homeCountry,
      user_type: userType
    }
  });

  if (createUserError || !createdUser.user) {
    const alreadyExists = createUserError?.message.toLowerCase().includes("already");

    if (!alreadyExists) {
      redirect("/signup?error=signup_failed");
    }

    const existingAuthUser = await findAuthUserByEmail(email);
    if (!existingAuthUser) {
      redirect("/signup?error=account_exists");
    }

    const { data: existingProfile } = await serviceSupabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", existingAuthUser.id)
      .maybeSingle();

    if (existingProfile) {
      redirect("/signup?error=account_exists");
    }

    const { error: updateUserError } = await serviceSupabase.auth.admin.updateUserById(existingAuthUser.id, {
      password,
      ...(authPhone ? { phone: authPhone, phone_confirm: true } : {}),
      email_confirm: true,
      user_metadata: {
        ...existingAuthUser.user_metadata,
        full_name: fullName,
        phone,
        current_country: currentCountry,
        home_country: homeCountry,
        user_type: userType
      }
    });

    if (updateUserError) {
      redirect("/signup?error=signup_failed");
    }

    const { error: repairedProfileError } = await upsertProfileForAuthUser({
      authUserId: existingAuthUser.id,
      currentCountry,
      email,
      fullName,
      homeCountry,
      phone,
      userType
    });

    if (repairedProfileError) {
      redirect("/signup?error=profile_failed");
    }

    const authSupabase = await createAuthSupabaseServerClient();
    const { error: signInError } = await authSupabase.auth.signInWithPassword({ email, password });

    if (signInError) redirect("/login?message=account_created");

    redirect("/dashboard");
  }

  const { error: profileError } = await upsertProfileForAuthUser({
    authUserId: createdUser.user.id,
    currentCountry,
    email,
    fullName,
    homeCountry,
    phone,
    userType
  });

  if (profileError) redirect("/signup?error=profile_failed");

  const authSupabase = await createAuthSupabaseServerClient();
  const { error: signInError } = await authSupabase.auth.signInWithPassword({ email, password });

  if (signInError) redirect("/login?message=account_created");

  redirect("/dashboard");
}

export async function logoutAction() {
  if (!isSupabaseConfigured()) redirect("/");
  const supabase = await createAuthSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfileAction(formData: FormData) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect("/profile?error=not_configured");
  }

  const authSupabase = await createAuthSupabaseServerClient();
  const { data: authData } = await authSupabase.auth.getUser();
  if (!authData.user) redirect("/login?next=/profile");

  const fullName = requireValue(formData, "fullName");
  const email = requireValue(formData, "email");
  const phone = requireValue(formData, "phone");
  const userType = requireValue(formData, "userType");
  const currentCountry = requireValue(formData, "currentCountry");
  const homeCountry = requireValue(formData, "homeCountry");
  const authPhone = phoneForSupabaseAuth(phone);
  const serviceSupabase = createServiceSupabaseClient();
  const photo = formData.get("profilePhoto");
  let avatarUrl =
    typeof authData.user.user_metadata?.avatar_url === "string"
      ? authData.user.user_metadata.avatar_url
      : undefined;

  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      redirect(`/profile?error=${encodeURIComponent("Please upload an image file.")}`);
    }

    await serviceSupabase.storage.createBucket("profile-photos", {
      public: true,
      fileSizeLimit: 2 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"]
    });

    const path = `${authData.user.id}/${Date.now()}-${safeFileName(photo.name)}`;
    const { error: uploadError } = await serviceSupabase.storage
      .from("profile-photos")
      .upload(path, photo, {
        cacheControl: "3600",
        upsert: true,
        contentType: photo.type
      });

    if (uploadError) {
      redirect(`/profile?error=${encodeURIComponent(uploadError.message)}`);
    }

    avatarUrl = serviceSupabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
  }

  const { error: profileError } = await serviceSupabase
    .from("profiles")
    .update({
      full_name: fullName,
      email,
      phone,
      current_country: currentCountry,
      home_country: homeCountry,
      user_type: userType,
      avatar_initials: initials(fullName),
      updated_at: new Date().toISOString()
    })
    .eq("auth_user_id", authData.user.id);

  if (profileError) {
    redirect(`/profile?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error: authError } = await serviceSupabase.auth.admin.updateUserById(authData.user.id, {
    email,
    ...(authPhone ? { phone: authPhone, phone_confirm: true } : {}),
    user_metadata: {
      ...authData.user.user_metadata,
      full_name: fullName,
      avatar_url: avatarUrl,
      phone,
      current_country: currentCountry,
      home_country: homeCountry,
      user_type: userType
    }
  });

  if (authError) {
    redirect(`/profile?error=${encodeURIComponent(authError.message)}`);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/profile?saved=1");
}

export async function sendMessageAction(formData: FormData) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect("/chat");
  }

  const senderId = await requireCurrentProfileId();
  const recipientId = requireValue(formData, "recipientId");
  const body = requireValue(formData, "body");
  const existingConversationId = String(formData.get("conversationId") ?? "").trim();
  const subject = String(formData.get("subject") ?? "CarryLink conversation").trim() || "CarryLink conversation";

  if (recipientId === senderId) {
    redirect("/chat?error=cannot_message_self");
  }

  const supabase = createServiceSupabaseClient();
  let conversationId = existingConversationId;

  if (!conversationId) {
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({ subject, last_message_at: new Date().toISOString() })
      .select("id")
      .single();

    if (conversationError || !conversation) {
      redirect(`/chat?error=${encodeURIComponent(conversationError?.message ?? "Conversation could not be created")}`);
    }

    conversationId = conversation.id;

    const { error: participantError } = await supabase.from("conversation_participants").insert([
      { conversation_id: conversationId, profile_id: senderId },
      { conversation_id: conversationId, profile_id: recipientId }
    ]);

    if (participantError) {
      redirect(`/chat?error=${encodeURIComponent(participantError.message)}`);
    }
  }

  const { error: messageError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    body
  });

  if (messageError) {
    redirect(`/chat?error=${encodeURIComponent(messageError.message)}`);
  }

  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath("/chat");
  revalidatePath("/dashboard");
  redirect(`/chat?conversation=${conversationId}`);
}

export async function createDeliveryRequestAction(formData: FormData) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect("/browse-requests");
  }

  const profileId = await requireCurrentProfileId();
  const supabase = createServiceSupabaseClient();

  const { error: requestError } = await supabase.from("delivery_requests").insert({
    sender_id: profileId,
    from_country: requireValue(formData, "fromCountry"),
    from_city: requireValue(formData, "fromCity"),
    to_country: requireValue(formData, "toCountry"),
    to_city: requireValue(formData, "toCity"),
    preferred_start_date: requireValue(formData, "startDate"),
    preferred_end_date: requireValue(formData, "endDate"),
    item_category: requireValue(formData, "category"),
    item_description: requireValue(formData, "description"),
    approximate_size: requireValue(formData, "size"),
    approximate_weight_kg: Number(requireValue(formData, "weight")),
    is_sealed: requireValue(formData, "sealed") === "Yes",
    offered_compensation: requireValue(formData, "compensation"),
    pickup_flexibility: requireValue(formData, "pickup"),
    delivery_flexibility: requireValue(formData, "delivery"),
    legal_confirmation: formData.get("legalConfirmation") === "on"
  });

  if (requestError) redirect(`/requests/new?error=${encodeURIComponent(requestError.message)}`);

  revalidatePath("/browse-requests");
  revalidatePath("/matches");
  revalidatePath("/dashboard");
  redirect("/dashboard?created=request");
}

export async function createTripAction(formData: FormData) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect("/travelers");
  }

  const profileId = await requireCurrentProfileId();
  const supabase = createServiceSupabaseClient();
  const departureDate = requireValue(formData, "departure");
  const arrivalDate = requireValue(formData, "arrival");

  if (dateTime(departureDate) < dateTime(todayIsoDate())) {
    redirect(`/trips/new?error=${encodeURIComponent("Departure date cannot be in the past.")}`);
  }

  if (dateTime(arrivalDate) < dateTime(todayIsoDate())) {
    redirect(`/trips/new?error=${encodeURIComponent("Arrival date cannot be in the past.")}`);
  }

  if (dateTime(arrivalDate) < dateTime(departureDate)) {
    redirect(`/trips/new?error=${encodeURIComponent("Arrival date cannot be before departure date.")}`);
  }

  const { error: tripError } = await supabase.from("trips").insert({
    traveler_id: profileId,
    from_country: requireValue(formData, "fromCountry"),
    from_city: requireValue(formData, "fromCity"),
    to_country: requireValue(formData, "toCountry"),
    to_city: requireValue(formData, "toCity"),
    departure_date: departureDate,
    arrival_date: arrivalDate,
    available_space: requireValue(formData, "space"),
    max_item_weight_kg: Number(requireValue(formData, "weight")),
    accepted_item_types: splitList(requireValue(formData, "accepted")),
    items_not_accepted: splitList(requireValue(formData, "notAccepted")),
    expected_compensation: requireValue(formData, "compensation"),
    meeting_preferences: requireValue(formData, "meeting"),
    notes: String(formData.get("notes") ?? "").trim(),
    status: "active"
  });

  if (tripError) redirect(`/trips/new?error=${encodeURIComponent(tripError.message)}`);

  revalidatePath("/travelers");
  revalidatePath("/matches");
  revalidatePath("/dashboard");
  redirect("/dashboard?created=trip");
}
