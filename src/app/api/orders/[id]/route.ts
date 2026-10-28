import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getOrderForSession } from "@/lib/queries";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const sid = await getSessionId();
  const row = await getOrderForSession(Number(id), sid);
  if (!row) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(row);
}
