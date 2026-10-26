import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ ok: false, error: "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ / Invalid email" }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ ok: false, error: "លេខសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួ / Password must be 6+ characters" }, { status: 400 });
  }
  if (name.length < 2) {
    return Response.json({ ok: false, error: "សូមបញ្ចូលឈ្មោះ / Name is required" }, { status: 400 });
  }

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return Response.json({ ok: false, error: "អ៊ីមែលនេះមានគណនីរួចហើយ / Email already registered" }, { status: 409 });
  }

  const [user] = await db
    .insert(users)
    .values({ email, name, phone, passwordHash: hashPassword(password) })
    .returning({ id: users.id, email: users.email, name: users.name });

  await setSessionCookie(user.id);
  return Response.json({ ok: true, user });
}
