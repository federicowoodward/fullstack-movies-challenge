import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../api";

declare global {
  // eslint-disable-next-line no-var
  var fetch: typeof fetch;
}

describe("apiFetch", () => {
  const originalFetch = global.fetch;
  const originalLocation = window.location;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
      writable: false,
    });
  });

  it("retries once after refreshing the token", async () => {
    const first = new Response(null, { status: 401 });
    const refresh = new Response(null, { status: 204 });
    const success = new Response(JSON.stringify({ success: true }), { status: 200 });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(refresh)
      .mockResolvedValueOnce(success);

    global.fetch = fetchMock as unknown as typeof global.fetch;

    const response = await apiFetch("/api/movies");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(response.status).toBe(200);
  });

  it("throws when refresh fails", async () => {
    const first = new Response(null, { status: 401 });
    const refresh = new Response(null, { status: 401 });

    const fetchMock = vi.fn().mockResolvedValueOnce(first).mockResolvedValueOnce(refresh);
    global.fetch = fetchMock as unknown as typeof global.fetch;

    const fakeLocation = { href: "" } as Location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: fakeLocation,
      writable: true,
    });

    await expect(apiFetch("/api/movies")).rejects.toThrow("Unauthorized");
    expect(window.location.href).toBe("/login");
  });
});
