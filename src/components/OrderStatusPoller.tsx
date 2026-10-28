"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Refreshes the page every few seconds while an order is still processing. */
export default function OrderStatusPoller({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [active, router]);

  return null;
}
