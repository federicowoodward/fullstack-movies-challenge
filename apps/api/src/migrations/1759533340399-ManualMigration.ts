import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "fs";
import * as path from "path";

type Row = Record<string, string>;

/** Simple CSV reader (header in first line, comma-separated, no quoted commas). */
async function readCsv(relPathFromMigrationDir: string): Promise<Row[]> {
  const filePath = path.resolve(__dirname, "..", relPathFromMigrationDir); // __dirname => src/migrations
  const raw = await fs.promises.readFile(filePath, "utf8");
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map(h => h.trim());
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    const row: Row = {};
    header.forEach((h, idx) => (row[h] = cols[idx] ?? ""));
    rows.push(row);
  }
  return rows;
}

export class ManualMigration1759533340399 implements MigrationInterface {
  name = "ManualMigration1759533340399";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Cargar CSV
    const directorsCsv = await readCsv("../seed/directors.csv");        // name
    const actorsCsv    = await readCsv("../seed/actors.csv");           // name
    const moviesCsv    = await readCsv("../seed/movies.csv");           // title,genre,year,director_name
    const mActorsCsv   = await readCsv("../seed/movie_actors.csv");     // movie_title,actor_name
    const tvCsv        = await readCsv("../seed/tvshows.csv");          // title,genre
    const seasonsCsv   = await readCsv("../seed/seasons.csv");          // tvshow_title,season_number
    const episodesCsv  = await readCsv("../seed/episodes.csv");         // tvshow_title,season_number,episode_number,title,director_name
    const tvActorsCsv  = await readCsv("../seed/tvshow_actors.csv");    // tvshow_title,actor_name

    // 2) Insertar Directores (map name -> id)
    const directorIdByName = new Map<string, number>();
    for (const d of directorsCsv) {
      const name = d.name?.trim();
      if (!name) continue;
      const res = await queryRunner.query(
        `INSERT INTO "director" ("name") VALUES ($1) RETURNING id`,
        [name]
      );
      directorIdByName.set(name, res[0].id);
    }

    // 3) Insertar Actores (map name -> id)
    const actorIdByName = new Map<string, number>();
    for (const a of actorsCsv) {
      const name = a.name?.trim();
      if (!name) continue;
      const res = await queryRunner.query(
        `INSERT INTO "actor" ("name") VALUES ($1) RETURNING id`,
        [name]
      );
      actorIdByName.set(name, res[0].id);
    }

    // 4) Insertar Movies (map title -> id)
    const movieIdByTitle = new Map<string, number>();
    for (const m of moviesCsv) {
      const title = m.title?.trim();
      const genre = (m.genre || "Unknown").trim();
      const year  = Number(m.year || 0) || new Date().getFullYear();
      const directorName = m.director_name?.trim();
      if (!title || !directorName) continue;

      const directorId = directorIdByName.get(directorName);
      if (!directorId) continue;

      const res = await queryRunner.query(
        `INSERT INTO "movie" ("title","genre","year","directorId")
         VALUES ($1,$2,$3,$4) RETURNING id`,
        [title, genre, year, directorId]
      );
      movieIdByTitle.set(title, res[0].id);
    }

    // 5) Insertar enlaces Movie <-> Actors
    const seenMovieActor = new Set<string>();
    for (const row of mActorsCsv) {
      const movieTitle = row.movie_title?.trim();
      const actorName  = row.actor_name?.trim();
      if (!movieTitle || !actorName) continue;

      const movieId = movieIdByTitle.get(movieTitle);
      const actorId = actorIdByName.get(actorName);
      if (!movieId || !actorId) continue;

      const key = `${movieId}:${actorId}`;
      if (seenMovieActor.has(key)) continue;
      seenMovieActor.add(key);

      await queryRunner.query(
        `INSERT INTO "movie_actors_actor" ("movieId","actorId") VALUES ($1,$2)
         ON CONFLICT ("movieId","actorId") DO NOTHING`,
        [movieId, actorId]
      );
    }

    // 6) Insertar TV Shows (map title -> id)
    const tvIdByTitle = new Map<string, number>();
    for (const t of tvCsv) {
      const title = t.title?.trim();
      const genre = (t.genre || "Unknown").trim();
      if (!title) continue;

      const res = await queryRunner.query(
        `INSERT INTO "tv_show" ("title","genre") VALUES ($1,$2) RETURNING id`,
        [title, genre]
      );
      tvIdByTitle.set(title, res[0].id);
    }

    // 7) Insertar Seasons (map key showTitle#seasonNumber -> id)
    const seasonIdByKey = new Map<string, number>();
    for (const s of seasonsCsv) {
      const showTitle    = s.tvshow_title?.trim();
      const seasonNumber = Number(s.season_number || 0);
      if (!showTitle || !seasonNumber) continue;

      const showId = tvIdByTitle.get(showTitle);
      if (!showId) continue;

      const res = await queryRunner.query(
        `INSERT INTO "season" ("seasonNumber","showId") VALUES ($1,$2) RETURNING id`,
        [seasonNumber, showId]
      );
      seasonIdByKey.set(`${showTitle}#${seasonNumber}`, res[0].id);
    }

    // 8) Insertar Episodes (usa director_name)
    for (const e of episodesCsv) {
      const showTitle     = e.tvshow_title?.trim();
      const seasonNumber  = Number(e.season_number || 0);
      const episodeNumber = Number(e.episode_number || 0);
      const title         = e.title?.trim();
      const directorName  = e.director_name?.trim();
      if (!showTitle || !seasonNumber || !episodeNumber || !title || !directorName) continue;

      const seasonId   = seasonIdByKey.get(`${showTitle}#${seasonNumber}`);
      const directorId = directorIdByName.get(directorName);
      if (!seasonId || !directorId) continue;

      await queryRunner.query(
        `INSERT INTO "episode" ("title","episodeNumber","seasonId","directorId")
         VALUES ($1,$2,$3,$4)`,
        [title, episodeNumber, seasonId, directorId]
      );
    }

    // 9) Insertar enlaces TV Show <-> Actors
    const seenShowActor = new Set<string>();
    for (const row of tvActorsCsv) {
      const showTitle = row.tvshow_title?.trim();
      const actorName = row.actor_name?.trim();
      if (!showTitle || !actorName) continue;

      const showId  = tvIdByTitle.get(showTitle);
      const actorId = actorIdByName.get(actorName);
      if (!showId || !actorId) continue;

      const key = `${showId}:${actorId}`;
      if (seenShowActor.has(key)) continue;
      seenShowActor.add(key);

      await queryRunner.query(
        `INSERT INTO "tv_show_actors_actor" ("tvShowId","actorId") VALUES ($1,$2)
         ON CONFLICT ("tvShowId","actorId") DO NOTHING`,
        [showId, actorId]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-cargar CSV para borrar exactamente lo insertado
    const moviesCsv   = await readCsv("../seed/movies.csv");
    const tvCsv       = await readCsv("../seed/tvshows.csv");
    const episodesCsv = await readCsv("../seed/episodes.csv");
    const actorsCsv   = await readCsv("../seed/actors.csv");
    const directorsCsv= await readCsv("../seed/directors.csv");

    // 1) Borrar joins (movies)
    if (moviesCsv.length) {
      const titles = moviesCsv.map(m => m.title?.trim()).filter(Boolean);
      const params = titles.map((_, i) => `$${i + 1}`).join(", ");
      await queryRunner.query(
        `DELETE FROM "movie_actors_actor"
         WHERE "movieId" IN (SELECT id FROM "movie" WHERE title IN (${params}))`,
        titles
      );
    }

    // 2) Borrar joins (tv shows)
    if (tvCsv.length) {
      const titles = tvCsv.map(t => t.title?.trim()).filter(Boolean);
      const params = titles.map((_, i) => `$${i + 1}`).join(", ");
      await queryRunner.query(
        `DELETE FROM "tv_show_actors_actor"
         WHERE "tvShowId" IN (SELECT id FROM "tv_show" WHERE title IN (${params}))`,
        titles
      );
    }

    // 3) Borrar episodes (por título del episodio en CSV)
    if (episodesCsv.length) {
      const eps = episodesCsv.map(e => e.title?.trim()).filter(Boolean);
      const params = eps.map((_, i) => `$${i + 1}`).join(", ");
      if (eps.length) {
        await queryRunner.query(
          `DELETE FROM "episode" WHERE "title" IN (${params})`,
          eps
        );
      }
    }

    // 4) Borrar seasons ligados a shows del CSV
    if (tvCsv.length) {
      const titles = tvCsv.map(t => t.title?.trim()).filter(Boolean);
      const params = titles.map((_, i) => `$${i + 1}`).join(", ");
      await queryRunner.query(
        `DELETE FROM "season"
         WHERE "showId" IN (SELECT id FROM "tv_show" WHERE title IN (${params}))`,
        titles
      );
    }

    // 5) Borrar tv shows
    if (tvCsv.length) {
      const titles = tvCsv.map(t => t.title?.trim()).filter(Boolean);
      const params = titles.map((_, i) => `$${i + 1}`).join(", ");
      await queryRunner.query(
        `DELETE FROM "tv_show" WHERE title IN (${params})`,
        titles
      );
    }

    // 6) Borrar movies
    if (moviesCsv.length) {
      const titles = moviesCsv.map(m => m.title?.trim()).filter(Boolean);
      const params = titles.map((_, i) => `$${i + 1}`).join(", ");
      await queryRunner.query(
        `DELETE FROM "movie" WHERE title IN (${params})`,
        titles
      );
    }

    // 7) Borrar actores/directores insertados
    if (actorsCsv.length) {
      const names = actorsCsv.map(a => a.name?.trim()).filter(Boolean);
      const params = names.map((_, i) => `$${i + 1}`).join(", ");
      await queryRunner.query(
        `DELETE FROM "actor" WHERE name IN (${params})`,
        names
      );
    }

    if (directorsCsv.length) {
      const names = directorsCsv.map(d => d.name?.trim()).filter(Boolean);
      const params = names.map((_, i) => `$${i + 1}`).join(", ");
      await queryRunner.query(
        `DELETE FROM "director" WHERE name IN (${params})`,
        names
      );
    }
  }
}
