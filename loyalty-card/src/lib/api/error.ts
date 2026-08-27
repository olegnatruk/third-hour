/** Thrown by the API helpers on any non-2xx response. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Pull the `{ error }` message out of a failed API response. */
export async function toApiError(response: Response): Promise<ApiError> {
  let message = response.statusText || "Request failed.";
  try {
    const body = (await response.json()) as { error?: unknown };
    if (body && typeof body.error === "string" && body.error.trim()) {
      message = body.error;
    }
  } catch {
    // non-JSON body — keep the status-based message
  }
  return new ApiError(response.status, message);
}
