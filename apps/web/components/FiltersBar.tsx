"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface FiltersBarProps {
  genre?: string;
  sort?: "title" | "year";
  onGenreChange: (value: string) => void;
  onSortChange: (value?: "title" | "year") => void;
  onReset?: () => void;
}

export function FiltersBar({ genre = "", sort, onGenreChange, onSortChange, onReset }: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
      <div className="flex-1">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Genre</label>
        <Input value={genre} onChange={(event) => onGenreChange(event.target.value)} placeholder="You must put the genre exactly as it looks in the list for result to be shown." />
      </div>
      <div className="w-full md:w-48">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sort by</label>
        <Select value={sort ?? ""} onChange={(event) => onSortChange(event.target.value ? (event.target.value as "title" | "year") : undefined)}>
          <option value="">None</option>
          <option value="title">Title</option>
          <option value="year">Year</option>
        </Select>
      </div>
      <div className="flex justify-end md:ml-auto">
        <Button type="button" variant="secondary" onClick={() => onReset?.()} className="w-full md:w-auto">
          Reset
        </Button>
      </div>
    </div>
  );
}

