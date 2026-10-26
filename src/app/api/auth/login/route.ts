import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json(
      { ok: false, error: "អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ / Invalid email or password" },
      { status: 401 },
    );
  }

  await setSessionCookie(user.id);
  return Response.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
}
