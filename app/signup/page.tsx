import Link from "next/link";
import { signupAction } from "@/app/actions";
import { PageHeader } from "@/components/PageHeader";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="Create your profile" description="Tell other members who you are and how you plan to use CarryLink." />
      <section className="section max-w-3xl">
        <form action={signupAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          {params.error === "account_exists" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">An account already exists for that email. Please log in instead.</p> : null}
          {params.error === "profile_failed" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">Account was created, but profile setup failed. Please contact support or try again.</p> : null}
          {params.error === "signup_failed" ? <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">Signup failed. Please check the details and try again.</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="fullName">Full name</label>
              <input className="field" id="fullName" name="fullName" required placeholder="Sara Haddad" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input className="field" id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone number</label>
              <input className="field" id="phone" name="phone" type="tel" required placeholder="+1 514 555 0124" />
            </div>
            <div>
              <label className="label" htmlFor="userType">User type</label>
              <select className="field" id="userType" name="userType" required defaultValue="Both">
                <option>Sender</option>
                <option>Traveler</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="currentCountry">Current country</label>
              <input className="field" id="currentCountry" name="currentCountry" required placeholder="Canada" />
            </div>
            <div>
              <label className="label" htmlFor="homeCountry">Home country</label>
              <input className="field" id="homeCountry" name="homeCountry" required placeholder="Lebanon" />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="password">Password</label>
              <input className="field" id="password" name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" />
            </div>
          </div>
          <button className="mt-6 w-full rounded-lg bg-trust px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink" type="submit">Sign up</button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account? <Link className="font-semibold text-trust" href="/login">Log in</Link>
          </p>
        </form>
      </section>
    </>
  );
}
