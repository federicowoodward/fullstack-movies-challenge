import { Suspense } from "react";
import MoviesPageClient from "./MoviesPageClient";

export default function MoviesPage() {
  return (
    <Suspense fallback={null}>
      <MoviesPageClient />
    </Suspense>
  );
}
