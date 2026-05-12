import Link from "next/link";
import { LogOut, PackageCheck, UserCircle } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { getCurrentAccount } from "@/lib/data";
import { brandName } from "@/lib/utils";
import { AutoRefresh } from "./AutoRefresh";
import { MobileMenu } from "./MobileMenu";
import { SessionTimeout } from "./SessionTimeout";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/travelers", label: "Find Traveler" },
  { href: "/trips/new", label: "Post Trip" },
  { href: "/matches", label: "Matches" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/safety", label: "Safety" }
];

export async function Header() {
  const currentAccount = await getCurrentAccount();

  return (
    <>
      <SessionTimeout isAuthenticated={Boolean(currentAccount)} />
      <AutoRefresh isAuthenticated={Boolean(currentAccount)} />
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-trust text-white">
              <PackageCheck size={19} aria-hidden />
            </span>
            <span className="truncate">{brandName}</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-trust">
                {item.label}
              </Link>
            ))}
          </nav>
          {currentAccount ? (
            <div className="flex items-center gap-2">
              <MobileMenu items={navItems} />
              <Link href="/profile" className="inline-flex items-center gap-2 rounded-lg bg-skywash px-3 py-2 text-sm font-semibold text-trust hover:bg-trust hover:text-white">
                <UserCircle size={17} aria-hidden />
                <span className="hidden sm:inline">{currentAccount.displayName}</span>
                <span className="sm:hidden">Profile</span>
              </Link>
              <form action={logoutAction}>
                <button suppressHydrationWarning className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-coral hover:text-coral" type="submit" aria-label="Log out">
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MobileMenu items={navItems} />
              <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:block">
                Login
              </Link>
              <Link href="/signup" className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-trust">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
