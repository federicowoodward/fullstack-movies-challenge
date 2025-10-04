import { z } from "zod";

const numberFromString = (value: unknown) => {
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value.trim());
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

const arrayFromCsv = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const segments = trimmed.split(",").map((segment) => Number(segment.trim())).filter((segment) => !Number.isNaN(segment));
    return segments.length ? segments : undefined;
  }
  return value;
};

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  year: z
    .preprocess((value) => {
      if (value === "" || value === undefined || value === null) return undefined;
      return numberFromString(value);
    }, z
      .number({ invalid_type_error: "Year must be a number" })
      .int("Year must be an integer")
      .min(1900, "Year must be after 1900")
      .max(2100, "Year must be before 2100"))
    .optional(),
  directorId: z.preprocess((value) => numberFromString(value), z.number({ invalid_type_error: "Director is required" }).int()),
  actorIds: z
    .preprocess((value) => arrayFromCsv(value), z.array(z.number().int()).optional())
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type MovieFormValues = z.infer<typeof movieSchema>;
