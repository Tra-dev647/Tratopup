/**
 * Client for the khmer-topup.com reseller API.
 * Server-side only: the API key must never reach the browser.
 */
const BASE_URL = process.env.SUPPLIER_BASE_URL ?? "https://khmer-topup.com/api/v1";

export function supplierEnabled() {
  return Boolean(process.env.SUPPLIER_API_KEY);
}

async function call<T>(path: string, init?: RequestInit): Promise<{ status: number; data: T }> {
  const key = process.env.SUPPLIER_API_KEY;
  if (!key) throw new Error("SUPPLIER_API_KEY is not set");
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { status: res.status, data };
}

export type CheckResult =
  | { result: "valid"; nickname: string }
  | { result: "invalid" }
  | { result: "incomplete"; message?: string }
  | { result: "unknown" };

/** Verify a player account. Costs nothing, safe to call before ordering. */
export async function supplierCheck(slug: string, playerId: string, serverId?: string): Promise<CheckResult> {
  const qs = new URLSearchParams({ slug, player_id: playerId });
  if (serverId) qs.set("server_id", serverId);
  try {
    const { data } = await call<CheckResult>(`/check?${qs.toString()}`);
    if (data && typeof data === "object" && "result" in data) return data;
    return { result: "unknown" };
  } catch {
    return { result: "unknown" };
  }
}

export type SupplierGame = {
  slug: string;
  name: string;
  id_label: string;
  server_label: string | null;
  packages: { package_id: number; name: string; price: number; tag?: string | null }[];
};

export async function supplierGames(): Promise<SupplierGame[]> {
  const { status, data } = await call<{ games?: SupplierGame[] }>("/games");
  if (status !== 200 || !data.games) throw new Error(`Supplier /games failed (${status})`);
  return data.games;
}

export async function supplierBalance() {
  const { status, data } = await call<{ balance?: number; currency?: string }>("/me");
  if (status !== 200) throw new Error(`Supplier /me failed (${status})`);
  return data;
}

export type SupplierOrder = {
  order_code: string;
  status: "processing" | "completed" | "refunded" | string;
  price: number;
  balance?: number;
  idempotent?: boolean;
};

/**
 * Place a supplier order. `reference` MUST be unique per customer order
 * (use our orderNo) so a retry never charges the wallet twice.
 */
export async function supplierCreateOrder(input: {
  packageId: number;
  playerId: string;
  serverId?: string;
  reference: string;
}) {
  const { status, data } = await call<SupplierOrder & { error?: string }>("/orders", {
    method: "POST",
    body: JSON.stringify({
      package_id: input.packageId,
      player_id: input.playerId,
      server_id: input.serverId || undefined,
      reference: input.reference,
    }),
  });
  if (status !== 200) throw new Error(data.error ?? `Supplier order failed (${status})`);
  return data;
}

export async function supplierOrderStatus(orderCode: string) {
  const { status, data } = await call<SupplierOrder & { error?: string }>(`/orders/${encodeURIComponent(orderCode)}`);
  if (status !== 200) throw new Error(data.error ?? `Supplier status failed (${status})`);
  return data;
}
