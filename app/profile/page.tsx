import { Camera } from "lucide-react";
import Image from "next/image";
import { updateProfileAction } from "@/app/actions";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentAccount } from "@/lib/data";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const params = await searchParams;
  const account = await getCurrentAccount();
  const user = account?.profile;
  const avatarUrl = typeof account?.authUser.user_metadata?.avatar_url === "string" ? account.authUser.user_metadata.avatar_url : "";
  if (!user) {
    return (
      <>
        <PageHeader title="Profile" description="Your account is logged in, but no profile record was found yet." />
        <section className="section max-w-4xl">
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-soft">
            Logged in as {account?.displayName ?? "this account"}. Please complete signup again or contact support to create the missing profile record.
          </div>
        </section>
      </>
    );
  }
  return (
    <>
      <PageHeader title="Profile" description="Manage the identity details other members use to build trust before arranging a handoff." />
      <section className="section max-w-4xl">
        <form action={updateProfileAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          {params.saved ? <p className="mb-5 rounded-lg bg-skywash p-4 text-sm font-semibold text-trust">Profile saved successfully.</p> : null}
          {params.error ? <p className="mb-5 rounded-lg bg-coral/10 p-4 text-sm font-semibold text-coral">Profile was not saved: {params.error}</p> : null}
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-20 w-20 overflow-hidden rounded-full bg-skywash text-xl font-semibold text-trust">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={`${user.fullName} profile photo`} width={80} height={80} className="h-full w-full object-cover" />
              ) : (
                <span className="self-center justify-self-center">{user.avatarInitials}</span>
              )}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-ink hover:border-trust hover:text-trust">
              <Camera size={16} /> Profile photo
              <input className="sr-only" name="profilePhoto" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="label" htmlFor="fullName">Full name</label><input className="field" id="fullName" name="fullName" defaultValue={user.fullName} required /></div>
            <div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" defaultValue={user.email} required /></div>
            <div><label className="label" htmlFor="phone">Phone number</label><input className="field" id="phone" name="phone" defaultValue={user.phone} required /></div>
            <div><label className="label" htmlFor="userType">User type</label><select className="field" id="userType" name="userType" defaultValue={user.userType}><option>Sender</option><option>Traveler</option><option>Both</option></select></div>
            <div><label className="label" htmlFor="currentCountry">Current country</label><input className="field" id="currentCountry" name="currentCountry" defaultValue={user.currentCountry} required /></div>
            <div><label className="label" htmlFor="homeCountry">Home country</label><input className="field" id="homeCountry" name="homeCountry" defaultValue={user.homeCountry} required /></div>
          </div>
          <button className="mt-6 rounded-lg bg-trust px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink" type="submit">Save profile</button>
        </form>
      </section>
    </>
  );
}
