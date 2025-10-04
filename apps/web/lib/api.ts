import { redirect } from "next/navigation";
import type { ApiResponse, EpisodeDetail, Movie } from "./types";

class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const attempt = () =>
    fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });

  let response = await attempt();
  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (refreshResponse.status === 204) {
    response = await attempt();
    if (response.status !== 401) {
      return response;
    }
  }

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  } else {
    redirect("/login");
  }

  throw new UnauthorizedError();
}

export async function apiFetchJSON<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await apiFetch(input, init);
  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);
  if (!response.ok) {
    const message = (data as ApiResponse<unknown>)?.message ?? "Request failed";
    const error = new Error(message);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return data;
}

export type MovieListResponse = ApiResponse<Movie[]>;

export function buildMoviesQuery(params?: { genre?: string; sort?: "title" | "year" }) {
  const url = new URLSearchParams();
  if (params?.genre) url.set("genre", params.genre);
  if (params?.sort) url.set("sort", params.sort);
  const queryString = url.toString();
  return queryString ? `/api/movies?${queryString}` : "/api/movies";
}

export async function getMovies(params?: { genre?: string; sort?: "title" | "year" }) {
  const key = buildMoviesQuery(params);
  return apiFetchJSON<MovieListResponse>(key);
}

export async function createMovie(body: {
  title: string;
  genre: string;
  year?: number;
  directorId: number;
  actorIds?: number[];
}) {
  const response = await apiFetchJSON<ApiResponse<Movie>>("/api/movies", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return response;
}

export async function getEpisode(
  showId: number,
  episodeId: number,
  options: { cookie?: string } = {}
): Promise<ApiResponse<EpisodeDetail>> {
  const url = `/api/tvshows/${showId}/episodes/${episodeId}`;
  const response = await fetch(url, {
    headers: options.cookie ? { cookie: options.cookie } : undefined,
    cache: "no-store",
    credentials: "include",
  });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as ApiResponse<EpisodeDetail>) : undefined;
  if (!response.ok || !data) {
    const error = new Error(data?.message ?? "Request failed");
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return data;
}




