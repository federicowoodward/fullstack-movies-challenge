// apps/scripts/omdb-to-csv/index.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---- utils de ruta (ESM) ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- config ---
const API_KEY = process.env.OMDB_API_KEY || '';
console.log('Using OMDB_API_KEY:', API_KEY);
if (!API_KEY) {
  console.error('OMDB_API_KEY missing in .env');
  process.exit(1);
}

// destino: apps/api/src/seed
const seedDir = path.resolve(__dirname, '../../api/src/seed');
const out = {
  directors: path.join(seedDir, 'directors.csv'),
  actors: path.join(seedDir, 'actors.csv'),
  movies: path.join(seedDir, 'movies.csv'),
  movieActors: path.join(seedDir, 'movie_actors.csv'),
  tvshows: path.join(seedDir, 'tvshows.csv'),
  seasons: path.join(seedDir, 'seasons.csv'),
  episodes: path.join(seedDir, 'episodes.csv'),
  tvshowActors: path.join(seedDir, 'tvshow_actors.csv'),
};

// helpers CSV
function ensureSeedDir() {
  if (!fs.existsSync(seedDir)) fs.mkdirSync(seedDir, { recursive: true });
}

function csvHeader(file, header) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, header + '\n', 'utf8');
}

function sanitizeCell(v) {
  return String(v ?? '').replace(/[\r\n,]+/g, ' ').trim();
}

function appendCsv(file, row) {
  fs.appendFileSync(file, row.map(sanitizeCell).join(',') + '\n', 'utf8');
}

// ---- OMDb helpers ----
const BASE = 'https://www.omdbapi.com/';

async function searchTitles(term, type) {
  const results = [];
  for (let page = 1; page <= 5; page++) { // 5 páginas = 50 items por término
    const url = new URL(BASE);
    url.searchParams.set('apikey', API_KEY);
    url.searchParams.set('s', term);
    if (type) url.searchParams.set('type', type);
    url.searchParams.set('page', String(page));
    const r = await fetch(url);
    const j = await r.json();
    if (j.Response === 'True' && Array.isArray(j.Search)) {
      results.push(...j.Search.map(s => s.imdbID));
      const total = Number(j.totalResults || '0');
      if (page * 10 >= total) break;
    } else {
      break;
    }
    await new Promise(res => setTimeout(res, 150));
  }
  // unique
  return [...new Set(results)];
}

async function fetchById(id) {
  const url = new URL(BASE);
  url.searchParams.set('apikey', API_KEY);
  url.searchParams.set('i', id);
  url.searchParams.set('plot', 'short');
  const r = await fetch(url);
  return await r.json();
}

function splitList(s) {
  if (!s || s === 'N/A') return [];
  return s.split(',').map(x => x.trim()).filter(Boolean);
}

async function main() {
  ensureSeedDir();
  csvHeader(out.directors, 'name');
  csvHeader(out.actors, 'name');
  csvHeader(out.movies, 'title,genre,year,director_name');
  csvHeader(out.movieActors, 'movie_title,actor_name');
  csvHeader(out.tvshows, 'title,genre');
  csvHeader(out.seasons, 'tvshow_title,season_number');
  csvHeader(out.episodes, 'tvshow_title,season_number,episode_number,title,director_name');
  csvHeader(out.tvshowActors, 'tvshow_title,actor_name');

  // términos (desde argv o default)
  const termsArg = process.argv[2];
  const terms = termsArg ? termsArg.split(',').map(s => s.trim()) : [
    'Batman', 'Inception', 'Blade Runner', 'Barbie', 'Mindhunter', 'True Detective'
  ];

  // 1) Películas
  const movieIds = new Set();
  for (const t of terms) {
    const ids = await searchTitles(t, 'movie');
    ids.forEach(id => movieIds.add(id));
  }

  // 2) Series
  const showIds = new Set();
  for (const t of terms) {
    const ids = await searchTitles(t, 'series');
    ids.forEach(id => showIds.add(id));
  }

  const directors = new Set();
  const actors = new Set();

  // Dump películas
  for (const id of movieIds) {
    const it = await fetchById(id);
    if (it.Type !== 'movie') continue;
    const year = Number((it.Year || '').slice(0, 4)) || new Date().getFullYear();
    const genre = (it.Genre || 'Unknown').split(',')[0].trim();
    const director = splitList(it.Director)[0] || 'Unknown';
    const actorList = splitList(it.Actors);

    appendCsv(out.movies, [it.Title, genre, String(year), director]);
    if (director) directors.add(director);
    actorList.forEach(a => {
      if (a) actors.add(a);
      appendCsv(out.movieActors, [it.Title, a]);
    });
  }

  // Dump series, 1 temporada y 3 episodios por temporada (para no quemar cuota)
  for (const id of showIds) {
    const it = await fetchById(id);
    if (it.Type !== 'series') continue;

    appendCsv(out.tvshows, [it.Title, (it.Genre || 'Unknown').split(',')[0].trim()]);
    const totalSeasons = Number(it.totalSeasons || '0') || 1;
    const seasonsToPull = Math.min(totalSeasons, 1);

    for (let s = 1; s <= seasonsToPull; s++) {
      appendCsv(out.seasons, [it.Title, String(s)]);

      const url = new URL(BASE);
      url.searchParams.set('apikey', API_KEY);
      url.searchParams.set('i', it.imdbID);
      url.searchParams.set('Season', String(s));
      const r = await fetch(url);
      const j = await r.json();
      const eps = Array.isArray(j?.Episodes) ? j.Episodes.slice(0, 3) : [];
      for (const e of eps) {
        const ep = await fetchById(e.imdbID);
        const dir = splitList(ep.Director)[0] || 'Unknown';
        appendCsv(out.episodes, [it.Title, String(s), e.Episode, ep.Title, dir]);
        if (dir) directors.add(dir);
      }
    }

    splitList(it.Actors).forEach(a => {
      if (a) actors.add(a);
      appendCsv(out.tvshowActors, [it.Title, a]);
    });
  }

  // volcar sets
  directors.forEach(d => appendCsv(out.directors, [d]));
  actors.forEach(a => appendCsv(out.actors, [a]));

  console.log('CSV generated at apps/api/src/seed');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
