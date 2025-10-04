"use client";

import { DataTable } from "@/components/DataTable";
import { FiltersBar } from "@/components/FiltersBar";
import { buildMoviesQuery } from "@/lib/api";
import type { Movie } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import useSWR from "swr";

const skeletonRows = Array.from({ length: 5 });

type MoviesResponse = { success: boolean; message: string; data: Movie[] };

export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const genre = searchParams.get("genre") ?? "";
  const sort = (searchParams.get("sort") as "title" | "year" | null) ?? undefined;

  const key = useMemo(() => buildMoviesQuery({ genre: genre || undefined, sort }), [genre, sort]);
  const { data, error, isLoading } = useSWR<MoviesResponse>(key);

  const setParam = useCallback(
    (keyParam: "genre" | "sort", value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value.length > 0) {
        params.set(keyParam, value);
      } else {
        params.delete(keyParam);
      }
      const query = params.toString();
      router.replace((query ? `${pathname}?${query}` : pathname) as any);
    },
    [pathname, router, searchParams]
  );

  const movies = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Movies</h1>
          <p className="mt-1 text-sm text-slate-600">Search and filter through the catalog.</p>
        </div>
      </div>

      <FiltersBar
        genre={genre}
        sort={sort}
        onGenreChange={(value) => setParam("genre", value)}
        onSortChange={(value) => setParam("sort", value ?? "")}
        onReset={() => router.replace(pathname as any)}
      />

      {isLoading ? (
        <div className="space-y-3">
          {skeletonRows.map((_, index) => (
            <div key={index} className="skeleton h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {(error as Error).message || "Unable to load movies"}
        </div>
      ) : (
        <DataTable<Movie>
          data={movies}
          emptyLabel="No movies found"
          columns={[
            { key: "id", header: "ID", className: "w-16" },
            { key: "title", header: "Title" },
            { key: "genre", header: "Genre" },
            { key: "year", header: "Year", className: "w-24" },
            {
              key: "director",
              header: "Director",
              render: (movie) => movie.director?.name ?? "�",
            },
            {
              key: "actors",
              header: "Actors",
              render: (movie) => movie.actors.map((actor) => actor.name).join(", ") || "�",
            },
          ]}
        />
      )}
    </div>
  );
}
