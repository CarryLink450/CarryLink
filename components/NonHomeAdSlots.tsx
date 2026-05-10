"use client";

import { usePathname } from "next/navigation";
import { AdSlot } from "./AdSlot";

export function NonHomeAdSlots({ position }: { position: "top" | "bottom" }) {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <section className={`section ${position === "top" ? "pb-0" : "pt-0"}`}>
      <AdSlot
        slot={position === "top" ? "1515151515" : "1616161616"}
        format="horizontal"
      />
    </section>
  );
}
