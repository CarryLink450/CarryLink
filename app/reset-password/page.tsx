import { updatePasswordAction } from "@/app/actions";
import { PageHeader } from "@/components/PageHeader";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader title="Reset password" description="Choose a new password for your CarryLink account." />
      <section className="section max-w-xl">
        <form action={updatePasswordAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          {params.error ? (
            <p className="mb-4 rounded-lg bg-coral/10 p-3 text-sm text-coral">{params.error}</p>
          ) : null}
          <label className="label" htmlFor="password">New password</label>
          <input className="field" id="password" name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" />
          <label className="label mt-4" htmlFor="confirmPassword">Confirm new password</label>
          <input className="field" id="confirmPassword" name="confirmPassword" type="password" required minLength={8} placeholder="Repeat your new password" />
          <button className="mt-6 w-full rounded-lg bg-trust px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink" type="submit">
            Update password
          </button>
        </form>
      </section>
    </>
  );
}
