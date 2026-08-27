import { cookies, headers } from "next/headers";
import { toApiError } from "./error";

type JsonBody = Record<string, unknown> | undefined;
type RequestOptions = Omit<RequestInit, "body"> & { body?: JsonBody };

async function resolveOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/**
 * Server-component API caller. Calls the app's own `/api/**` routes over
 * HTTP, forwarding the incoming Supabase session cookie so the route's
 * server-side role checks run for the current user. Never cached.
 * Throws `ApiError` on non-2xx.
 */
export async function serverFetch<T>(
  path: string,
  { body, headers: extraHeaders, ...init }: RequestOptions = {},
): Promise<T> {
  const origin = await resolveOrigin();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(`${origin}${path}`, {
    ...init,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...extraHeaders,
      cookie: cookieHeader,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
