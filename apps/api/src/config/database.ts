//run time file
import { DataSource } from "typeorm";
import { Movie } from "../entities/Movie";
import { TVShow } from "../entities/TVShow";
import { Season } from "../entities/Season";
import { Episode } from "../entities/Episode";
import { Actor } from "../entities/Actor";
import { Director } from "../entities/Director";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "challenge",
  entities: [Movie, TVShow, Season, Episode, Actor, Director],
  synchronize: false,
  logging: false,
});
