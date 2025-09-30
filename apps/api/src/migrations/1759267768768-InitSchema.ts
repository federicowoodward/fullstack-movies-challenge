import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1759267768768 implements MigrationInterface {
    name = 'InitSchema1759267768768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "director" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b85b179882f31c43324ef124fea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "episode" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "episodeNumber" integer NOT NULL, "seasonId" integer, "directorId" integer, CONSTRAINT "PK_7258b95d6d2bf7f621845a0e143" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "season" ("id" SERIAL NOT NULL, "seasonNumber" integer NOT NULL, "showId" integer, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tv_show" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "genre" character varying NOT NULL, CONSTRAINT "PK_f1c243400f03d802cd41d81cdf5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "actor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_05b325494fcc996a44ae6928e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "genre" character varying NOT NULL, "year" integer NOT NULL, "directorId" integer, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tv_show_actors_actor" ("tvShowId" integer NOT NULL, "actorId" integer NOT NULL, CONSTRAINT "PK_a01b4a6cefb0d4b89eac53ae394" PRIMARY KEY ("tvShowId", "actorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_36641f8646d2a378cff1ecd12b" ON "tv_show_actors_actor" ("tvShowId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d2ebc11c66399840ebc6f574f" ON "tv_show_actors_actor" ("actorId") `);
        await queryRunner.query(`CREATE TABLE "movie_actors_actor" ("movieId" integer NOT NULL, "actorId" integer NOT NULL, CONSTRAINT "PK_a69e570bd35d7cd2139d12270e9" PRIMARY KEY ("movieId", "actorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_992f9af300d8c96c46fea4e541" ON "movie_actors_actor" ("movieId") `);
        await queryRunner.query(`CREATE INDEX "IDX_65be8ded67af2677acfd19854c" ON "movie_actors_actor" ("actorId") `);
        await queryRunner.query(`ALTER TABLE "episode" ADD CONSTRAINT "FK_e73d28c1e5e3c85125163f7c9cd" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "episode" ADD CONSTRAINT "FK_1f0c3aa04e89df7d741ba7175f9" FOREIGN KEY ("directorId") REFERENCES "director"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "season" ADD CONSTRAINT "FK_1addcb12701996373de04873742" FOREIGN KEY ("showId") REFERENCES "tv_show"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_a32a80a88aff67851cf5b75d1cb" FOREIGN KEY ("directorId") REFERENCES "director"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tv_show_actors_actor" ADD CONSTRAINT "FK_36641f8646d2a378cff1ecd12b4" FOREIGN KEY ("tvShowId") REFERENCES "tv_show"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tv_show_actors_actor" ADD CONSTRAINT "FK_1d2ebc11c66399840ebc6f574fa" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "FK_992f9af300d8c96c46fea4e5419" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" ADD CONSTRAINT "FK_65be8ded67af2677acfd19854c2" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "FK_65be8ded67af2677acfd19854c2"`);
        await queryRunner.query(`ALTER TABLE "movie_actors_actor" DROP CONSTRAINT "FK_992f9af300d8c96c46fea4e5419"`);
        await queryRunner.query(`ALTER TABLE "tv_show_actors_actor" DROP CONSTRAINT "FK_1d2ebc11c66399840ebc6f574fa"`);
        await queryRunner.query(`ALTER TABLE "tv_show_actors_actor" DROP CONSTRAINT "FK_36641f8646d2a378cff1ecd12b4"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_a32a80a88aff67851cf5b75d1cb"`);
        await queryRunner.query(`ALTER TABLE "season" DROP CONSTRAINT "FK_1addcb12701996373de04873742"`);
        await queryRunner.query(`ALTER TABLE "episode" DROP CONSTRAINT "FK_1f0c3aa04e89df7d741ba7175f9"`);
        await queryRunner.query(`ALTER TABLE "episode" DROP CONSTRAINT "FK_e73d28c1e5e3c85125163f7c9cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65be8ded67af2677acfd19854c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_992f9af300d8c96c46fea4e541"`);
        await queryRunner.query(`DROP TABLE "movie_actors_actor"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d2ebc11c66399840ebc6f574f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_36641f8646d2a378cff1ecd12b"`);
        await queryRunner.query(`DROP TABLE "tv_show_actors_actor"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "actor"`);
        await queryRunner.query(`DROP TABLE "tv_show"`);
        await queryRunner.query(`DROP TABLE "season"`);
        await queryRunner.query(`DROP TABLE "episode"`);
        await queryRunner.query(`DROP TABLE "director"`);
    }

}
