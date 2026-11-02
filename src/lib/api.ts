export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(`/api/backend/${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...init?.headers,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const payload = data as { error?: { message?: string } } | null;
      return { data: null, error: payload?.error?.message ?? "The API request failed." };
    }
    return { data: data as T, error: null };
  } catch {
    return { data: null, error: "Could not connect to the API." };
  }
}
