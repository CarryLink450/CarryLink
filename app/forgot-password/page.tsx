import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions";
import { PageHeader } from "@/components/PageHeader";

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader title="Forgot password" description="Enter your account email and we will send you a secure password reset link." />
      <section className="section max-w-xl">
        <form action={forgotPasswordAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          {params.error ? (
            <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">{params.error}</p>
          ) : null}
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" name="email" type="email" required placeholder="you@example.com" />
          <button className="mt-6 w-full rounded-lg bg-trust px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink" type="submit">
            Send reset link
          </button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Remembered your password? <Link className="font-semibold text-trust" href="/login">Log in</Link>
          </p>
        </form>
      </section>
    </>
  );
}
