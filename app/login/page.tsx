import Link from "next/link";
import { loginAction } from "@/app/actions";
import { PageHeader } from "@/components/PageHeader";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; message?: string; detail?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="Log in" description="Access your dashboard, matches, and conversations." />
      <section className="section max-w-xl">
        <form action={loginAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          {params.error === "email_not_confirmed" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">Please confirm your email address before logging in.</p> : null}
          {params.error === "invalid_credentials" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">Login failed. Check your email and password.</p> : null}
          {params.error === "reset_session_expired" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">Your password reset session expired. Please request a new reset link.</p> : null}
          {params.error === "auth_callback_failed" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">The email link could not be verified. {params.detail ? params.detail : "Please request a new link and try again."}</p> : null}
          {params.message === "check_email" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Account created. Please check your email and confirm your account before logging in.</p> : null}
          {params.message === "email_confirmed" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Email confirmed. Please log in with your email and password.</p> : null}
          {params.message === "account_created" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Account created. Log in with the email and password you just used.</p> : null}
          {params.message === "profile_repaired" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Your profile was restored. Check your email to set your password, then log in.</p> : null}
          {params.message === "reset_email_sent" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Password reset email sent. Check your inbox for the secure reset link.</p> : null}
          {params.message === "password_updated" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Password updated. Please log in with your new password.</p> : null}
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" name="email" type="email" required placeholder="you@example.com" />
          <label className="label mt-4" htmlFor="password">Password</label>
          <input className="field" id="password" name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" />
          <div className="mt-3 text-right">
            <Link className="text-sm font-semibold text-trust hover:text-ink" href="/forgot-password">Forgot password?</Link>
          </div>
          <button className="mt-6 w-full rounded-lg bg-trust px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink" type="submit">Log in</button>
          <p className="mt-4 text-center text-sm text-slate-600">
            New here? <Link className="font-semibold text-trust" href="/signup">Create an account</Link>
          </p>
        </form>
      </section>
    </>
  );
}
