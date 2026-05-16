import type { Metadata } from "next";
import "./globals.css";
import { AdSenseScript } from "@/components/AdSenseScript";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { brandName } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${brandName} | Trusted peer travel delivery`,
  description: "Match senders with trusted travelers for small international deliveries.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AdSenseScript />
      </head>
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const removeInjectedAttributes = (root = document) => {
                  root.querySelectorAll?.("[fdprocessedid]").forEach((element) => {
                    element.removeAttribute("fdprocessedid");
                  });
                };

                removeInjectedAttributes();

                new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                    if (mutation.type === "attributes" && mutation.attributeName === "fdprocessedid") {
                      mutation.target.removeAttribute("fdprocessedid");
                    }

                    mutation.addedNodes.forEach((node) => {
                      if (node.nodeType !== Node.ELEMENT_NODE) return;
                      if (node.hasAttribute?.("fdprocessedid")) node.removeAttribute("fdprocessedid");
                      removeInjectedAttributes(node);
                    });
                  }
                }).observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                  attributeFilter: ["fdprocessedid"]
                });
              })();
            `
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
