import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Actor } from './Actor';
import { Season } from './Season';

@Entity()
export class TVShow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  // Many-to-Many: a TVShow can have many Actors (and actors can be in many shows)
  @ManyToMany(() => Actor, actor => actor.tvShows, { eager: false })
  @JoinTable()  // owning side of TVShow-Actor relationship
  actors: Actor[];

  // One-to-Many: a TVShow has multiple Seasons
  @OneToMany(() => Season, season => season.show, { cascade: true })
  seasons: Season[];
}
