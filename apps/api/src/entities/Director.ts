import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Movie } from './Movie';
import { Episode } from './Episode';

@Entity()
export class Director {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // One director can direct many movies
  @OneToMany(() => Movie, movie => movie.director)
  movies: Movie[];

  // One director can direct many TV show episodes
  @OneToMany(() => Episode, episode => episode.director)
  episodes: Episode[];
}
