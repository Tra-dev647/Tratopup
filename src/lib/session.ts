import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const SESSION_COOKIE = "kt_sid";

/** Read the current anonymous session id (may be undefined on first visit). */
export async function getSessionId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

/**
 * Read the session id, creating and persisting a new one when missing.
 * Only call this from Route Handlers or Server Actions (cookie writes).
 */
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sid = randomUUID();
  store.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return sid;
}
