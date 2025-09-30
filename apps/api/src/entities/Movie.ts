import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Actor } from './Actor';
import { Director } from './Director';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  year: number;

  // Many-to-One: each Movie has one Director
  @ManyToOne(() => Director, director => director.movies, { eager: false })
  director: Director;

  // Many-to-Many: a Movie can have many Actors, and an Actor can be in many Movies
  @ManyToMany(() => Actor, actor => actor.movies, { eager: false })
  @JoinTable()  // owning side of Movie-Actor relationship
  actors: Actor[];
}
