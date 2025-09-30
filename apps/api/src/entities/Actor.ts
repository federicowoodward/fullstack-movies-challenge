import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Movie } from './Movie';
import { TVShow } from './TVShow';

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Many-to-many relationship with Movie (Movie.actors is the owning side)
  @ManyToMany(() => Movie, movie => movie.actors)
  movies: Movie[];

  // Many-to-many relationship with TVShow (TVShow.actors is the owning side)
  @ManyToMany(() => TVShow, show => show.actors)
  tvShows: TVShow[];
}
