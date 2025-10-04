import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Use the navigation below to browse movies, add new records or inspect TV show episodes powered by the API.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/movies" className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary">
          <h2 className="text-lg font-semibold text-slate-900">Browse Movies</h2>
          <p className="mt-2 text-sm text-slate-600">Search and filter movies sourced from the backend.</p>
        </Link>
        <Link href="/movies/new" className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary">
          <h2 className="text-lg font-semibold text-slate-900">Add Movie</h2>
          <p className="mt-2 text-sm text-slate-600">Create a new movie entry and link directors or actors.</p>
        </Link>
        <a href="http://localhost:3001/docs" className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary">
          <h2 className="text-lg font-semibold text-slate-900">API Docs</h2>
          <p className="mt-2 text-sm text-slate-600">Open the Swagger UI served by the backend in a new tab.</p>
        </a>
      </section>
    </div>
  );
}
