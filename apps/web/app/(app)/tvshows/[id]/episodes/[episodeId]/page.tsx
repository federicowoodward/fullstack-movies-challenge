import { getEpisode } from "@/lib/api";
import type { EpisodeDetail } from "@/lib/types";
import { cookies } from "next/headers";

interface EpisodePageProps {
  params: { id: string; episodeId: string };
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const showId = Number(params.id);
  const episodeId = Number(params.episodeId);

  if (Number.isNaN(showId) || Number.isNaN(episodeId)) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Invalid episode identifier.</div>;
  }

  try {
    const cookieHeader = cookies().toString();
    const { data } = await getEpisode(showId, episodeId, { cookie: cookieHeader });
    return <EpisodeDetails episode={data} />;
  } catch (error) {
    const status = (error as Error & { status?: number }).status;
    if (status === 404) {
      return <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">Episode not found for this TV show.</div>;
    }
    const message = error instanceof Error ? error.message : "Unable to load episode";
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>;
  }
}

function EpisodeDetails({ episode }: { episode: EpisodeDetail }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-slate-500">Episode</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{episode.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Episode {episode.episodeNumber} · Season {episode.season.seasonNumber} · {episode.season.show.title}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Show</p>
          <p className="mt-1 text-lg font-medium text-slate-900">{episode.season.show.title}</p>
          <p className="mt-2 text-sm text-slate-600">Season {episode.season.seasonNumber}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Director</p>
          <p className="mt-1 text-lg font-medium text-slate-900">{episode.director.name}</p>
        </div>
      </div>
    </div>
  );
}

