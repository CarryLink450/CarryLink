import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createAuthSupabaseServerClient } from "@/lib/supabase/server";

function safeRedirectPath(next: string | null) {
  return next?.startsWith("/") ? next : "/dashboard";
}

function normalizeOtpType(type: string | null) {
  if (!type) return null;
  return (type === "signup" ? "email" : type) as EmailOtpType;
}

function hashRedirectPage(requestUrl: URL) {
  const loginUrl = new URL("/login", requestUrl.origin);

  return new NextResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Confirming email...</title>
  </head>
  <body>
    <p>Confirming your email...</p>
    <script>
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const loginUrl = ${JSON.stringify(loginUrl.toString())};
      if (hash.get("error") || hash.get("error_code")) {
        const url = new URL(loginUrl);
        url.searchParams.set("error", "auth_callback_failed");
        if (hash.get("error_description")) {
          url.searchParams.set("detail", hash.get("error_description"));
        }
        window.location.replace(url.toString());
      } else {
        const url = new URL(loginUrl);
        url.searchParams.set("message", "email_confirmed");
        window.location.replace(url.toString());
      }
    </script>
  </body>
</html>`, {
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = normalizeOtpType(requestUrl.searchParams.get("type"));
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const safeNext = safeRedirectPath(next);
  const supabase = await createAuthSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
    }

    console.error("Supabase auth code exchange failed:", error.message);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type
    });

    if (!error) {
      return NextResponse.redirect(new URL(safeNext, requestUrl.origin));
    }

    console.error("Supabase auth token verification failed:", error.message);
  }

  if (!code && !tokenHash) {
    return hashRedirectPage(requestUrl);
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback_failed", requestUrl.origin));
}
