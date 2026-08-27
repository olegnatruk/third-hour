"use client";

import { ApiError, toApiError } from "./error";

type JsonBody = Record<string, unknown> | undefined;

type RequestOptions = Omit<RequestInit, "body"> & { body?: JsonBody };

/**
 * Browser-side API caller. Same-origin `/api/**` only; the browser
 * attaches the Supabase session cookie automatically. Throws `ApiError`
 * on non-2xx.
 */
export async function apiFetch<T>(
  path: string,
  { body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export { ApiError };
