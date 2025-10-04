import type { SWRConfiguration } from "swr";
import { apiFetch } from "./api";

export const swrConfig: SWRConfiguration = {
  fetcher: async (url: string) => {
    const response = await apiFetch(url);
    if (!response.ok) {
      const info = await response.json().catch(() => ({}));
      const error = new Error(info?.message ?? "Request failed");
      (error as Error & { status?: number }).status = response.status;
      (error as Error & { info?: unknown }).info = info;
      throw error;
    }
    return response.json();
  },
  revalidateOnFocus: false,
  shouldRetryOnError: false,
};
