"use client";

import { useEffect } from "react";

export function AutoRedirect({
  href,
  delayMs
}: {
  href: string;
  delayMs: number;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => window.location.assign(href), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, href]);

  return null;
}
