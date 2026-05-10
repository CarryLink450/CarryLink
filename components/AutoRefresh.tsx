"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 15 * 1000;
const RECENT_ACTIVITY_WINDOW_MS = 90 * 1000;
const ACTIVITY_EVENTS = ["click", "keydown", "mousedown", "mousemove", "scroll", "touchstart"];
const MESSAGE_AWARE_PATHS = ["/", "/chat", "/dashboard"];

function isEditingField() {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  return ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName);
}

export function AutoRefresh({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const lastActivityRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated || !MESSAGE_AWARE_PATHS.includes(pathname)) return;

    const markActivity = () => {
      lastActivityRef.current = Date.now();
    };

    markActivity();

    const interval = window.setInterval(() => {
      if (document.hidden || isEditingField()) return;
      if (Date.now() - lastActivityRef.current > RECENT_ACTIVITY_WINDOW_MS) return;

      router.refresh();
    }, REFRESH_INTERVAL_MS);

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, markActivity, { passive: true });
    });

    return () => {
      window.clearInterval(interval);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, markActivity);
      });
    };
  }, [isAuthenticated, pathname, router]);

  return null;
}
