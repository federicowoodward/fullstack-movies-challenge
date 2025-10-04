"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { createMovie } from "@/lib/api";
import type { MovieFormValues } from "@/lib/validators";
import { movieSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewMoviePage() {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      genre: "",
      year: undefined,
      directorId: undefined,
      actorIds: undefined,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        actorIds: values.actorIds?.length ? values.actorIds : undefined,
      };
      await createMovie(payload);
      toast({ title: "Movie created", variant: "success" });
      reset({ title: "", genre: "", year: undefined, directorId: undefined, actorIds: undefined });
      router.push("/movies");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create movie";
      toast({ title: "Failed to create movie", description: message, variant: "error" });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add a new movie</h1>
        <p className="mt-1 text-sm text-slate-600">Provide the movie metadata. Director and actor IDs must exist in the database.</p>
      </div>

      <form className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="title">
            Title
          </label>
          <Input id="title" placeholder="Movie title" {...register("title")} />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="genre">
              Genre
            </label>
            <Input id="genre" placeholder="Genre" {...register("genre")} />
            {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="year">
              Year
            </label>
            <Input id="year" type="number" placeholder="2024" {...register("year", { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} />
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="directorId">
              Director ID
            </label>
            <Input id="directorId" type="number" placeholder="1" {...register("directorId", { setValueAs: (value) => (value === "" ? undefined : Number(value)) })} />
            {errors.directorId && <p className="mt-1 text-sm text-red-600">{errors.directorId.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="actorIds">
              Actor IDs (comma separated)
            </label>
            <Input id="actorIds" placeholder="1,2,3" {...register("actorIds", { setValueAs: (value) => (value === "" ? undefined : value) })} />
            {errors.actorIds && <p className="mt-1 text-sm text-red-600">{errors.actorIds.message}</p>}
          </div>
        </div>

        <Button type="submit" loading={submitting}>
          Create movie
        </Button>
      </form>
    </div>
  );
}
