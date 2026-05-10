import Link from "next/link";
import { loginAction } from "@/app/actions";
import { PageHeader } from "@/components/PageHeader";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; message?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="Log in" description="Access your dashboard, matches, and conversations." />
      <section className="section max-w-xl">
        <form action={loginAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          {params.error === "email_not_confirmed" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">Please confirm your email address before logging in.</p> : null}
          {params.error === "invalid_credentials" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">Login failed. Check your email and password.</p> : null}
          {params.message === "check_email" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Account created. Check your email if confirmation is enabled, then log in.</p> : null}
          {params.message === "account_created" ? <p className="mb-4 rounded-lg bg-skywash p-3 text-sm text-trust">Account created. Log in with the email and password you just used.</p> : null}
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" name="email" type="email" required placeholder="you@example.com" />
          <label className="label mt-4" htmlFor="password">Password</label>
          <input className="field" id="password" name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" />
          <button className="mt-6 w-full rounded-lg bg-trust px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink" type="submit">Log in</button>
          <p className="mt-4 text-center text-sm text-slate-600">
            New here? <Link className="font-semibold text-trust" href="/signup">Create an account</Link>
          </p>
        </form>
      </section>
    </>
  );
}
