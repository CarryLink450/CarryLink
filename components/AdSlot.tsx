"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical";

const minHeightByFormat: Record<AdFormat, string> = {
  auto: "min-h-28",
  horizontal: "min-h-24",
  rectangle: "min-h-[280px]",
  vertical: "min-h-[360px]"
};

export function AdSlot({
  label = "Advertisement",
  slot,
  format = "auto",
  className = ""
}: {
  label?: string;
  slot?: string;
  format?: AdFormat;
  className?: string;
}) {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const canRenderAd = Boolean(publisherId && slot);

  useEffect(() => {
    if (!canRenderAd) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or script loading delays should not break the app shell.
    }
  }, [canRenderAd]);

  return (
    <aside
      aria-label={label}
      className={`rounded-lg border border-dashed border-slate-300 bg-white/85 p-3 text-center shadow-sm ${minHeightByFormat[format]} ${className}`}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      {canRenderAd ? (
        <ins
          className="adsbygoogle block"
          data-ad-client={publisherId}
          data-ad-format={format === "auto" ? "auto" : undefined}
          data-ad-slot={slot}
          data-full-width-responsive="true"
          style={{ display: "block" }}
        />
      ) : (
        <div className="flex h-full min-h-[inherit] items-center justify-center rounded-md bg-slate-50 px-4 py-8 text-sm text-slate-500">
          Google AdSense space
        </div>
      )}
    </aside>
  );
}
