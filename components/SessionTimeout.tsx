"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const INACTIVITY_LIMIT_MS = 2 * 60 * 1000;
const ACTIVITY_EVENTS = ["click", "keydown", "mousedown", "mousemove", "scroll", "touchstart"];

export function SessionTimeout({ isAuthenticated }: { isAuthenticated: boolean }) {
  const timeoutRef = useRef<number | null>(null);
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const clearTimer = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };

    const signOutForInactivity = async () => {
      if (signingOutRef.current) return;
      signingOutRef.current = true;

      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } finally {
        window.location.assign("/login?message=session_timeout");
      }
    };

    const resetTimer = () => {
      clearTimer();
      timeoutRef.current = window.setTimeout(signOutForInactivity, INACTIVITY_LIMIT_MS);
    };

    resetTimer();
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer, { passive: true });
    });

    return () => {
      clearTimer();
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [isAuthenticated]);

  return null;
}
