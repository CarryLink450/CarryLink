import Script from "next/script";

const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;

export function AdSenseScript() {
  if (!publisherId) return null;

  return (
    <Script
      async
      crossOrigin="anonymous"
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      strategy="afterInteractive"
    />
  );
}
