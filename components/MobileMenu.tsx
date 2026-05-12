"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-700"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
      </button>
      {open ? (
        <nav className="absolute left-4 right-4 top-[68px] z-40 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 shadow-soft" aria-label="Mobile navigation">
          <div className="grid gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 hover:bg-skywash hover:text-trust"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
