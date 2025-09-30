import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Season } from './Season';
import { Director } from './Director';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  episodeNumber: number;

  // Many-to-One: each Episode belongs to a Season
  @ManyToOne(() => Season, season => season.episodes)
  season: Season;

  // Many-to-One: each Episode has one Director
  @ManyToOne(() => Director, director => director.episodes)
  director: Director;
}
