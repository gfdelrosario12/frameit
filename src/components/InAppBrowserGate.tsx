"use client";

import { useMemo } from "react";

// Placeholder types retained if needed in the future
// type Os = "ios" | "android" | "other";

function isInAppBrowser(userAgent: string): boolean {
  const ua = userAgent || "";
  // Common in-app browser signatures (Messenger, Instagram, Facebook, TikTok, etc.)
  const patterns = [
    /FBAN|FBAV|FB_IAB|FBMD|FBSN|FBDV|FBID/i, // Facebook family
    /Instagram/i,
    /Messenger/i,
    /Line\//i,
    /TikTok/i,
    /Twitter/i,
    /Snapchat/i,
    /Pinterest/i,
    /Discord/i,
    /Telegram/i,
    /WhatsApp/i,
    /MicroMessenger|WeChat/i,
    /GSA/i, // Google app
    /Gmail/i,
    /Outlook/i,
    /KAKAOTALK/i,
    /;\s*wv\)/i, // Android WebView token present in many in-app browsers
  ];
  return patterns.some((re) => re.test(ua));
}

// No auto-redirect helpers; this component is a no-op placeholder

export default function InAppBrowserGate() {
  const ua = useMemo(
    () => (typeof navigator !== "undefined" ? navigator.userAgent : ""),
    []
  );
  useMemo(() => {
    if (!ua) return false;
    // Skip on dedicated download page
    try {
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/download")
      ) {
        return false;
      }
    } catch {}
    const byUa = isInAppBrowser(ua);
    // Weak WebView heuristic (avoid mislabeling Safari/Chrome)
    const byWebView = /;\s*wv\)/i.test(ua);
    return byUa || byWebView;
  }, [ua]);

  // This component intentionally does nothing (no auto-redirects)

  return null;
}
