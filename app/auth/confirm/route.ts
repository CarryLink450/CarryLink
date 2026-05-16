import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createAuthSupabaseServerClient } from "@/lib/supabase/server";

function normalizeOtpType(type: string | null) {
  if (!type) return null;
  return (type === "signup" ? "email" : type) as EmailOtpType;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function page(title: string, body: string, status = 200) {
  return new NextResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f6faf9;
        color: #10202b;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(92vw, 520px);
        border: 1px solid #d8e3ea;
        border-radius: 12px;
        background: #ffffff;
        padding: 32px;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
      }
      h1 {
        margin: 0 0 12px;
        font-size: 28px;
        line-height: 1.15;
      }
      p {
        color: #475569;
        font-size: 16px;
        line-height: 1.6;
      }
      button, a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        border: 0;
        border-radius: 10px;
        background: #157a70;
        color: #ffffff;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        padding: 0 18px;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = normalizeOtpType(requestUrl.searchParams.get("type"));
  const requestedNext = requestUrl.searchParams.get("next");
  const next = requestedNext?.startsWith("/") ? requestedNext : "/login";

  if (!tokenHash || !type) {
    return page(
      "Invalid confirmation link",
      `<h1>Invalid confirmation link</h1>
      <p>This email confirmation link is missing required information. Please request a new confirmation email.</p>
      <p><a href="/login">Go to login</a></p>`,
      400
    );
  }

  return page(
    "Confirm your email",
    `<h1>Confirm your email</h1>
    <p>Click the button below to activate your CarryLink account. This extra step protects your one-time link from automated email scanners.</p>
    <form method="post" action="/auth/confirm">
      <input type="hidden" name="token_hash" value="${escapeHtml(tokenHash)}" />
      <input type="hidden" name="type" value="${escapeHtml(type)}" />
      <input type="hidden" name="next" value="${escapeHtml(next)}" />
      <button type="submit">Confirm email</button>
    </form>`
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const tokenHash = String(formData.get("token_hash") ?? "");
  const type = normalizeOtpType(String(formData.get("type") ?? ""));

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_failed&detail=Confirmation link is missing required information.", request.url));
  }

  const supabase = await createAuthSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type
  });

  if (error) {
    console.error("Supabase auth confirmation failed:", error.message);
    return NextResponse.redirect(new URL(`/login?error=auth_callback_failed&detail=${encodeURIComponent(error.message)}`, request.url));
  }

  return NextResponse.redirect(new URL("/login?message=email_confirmed", request.url));
}
