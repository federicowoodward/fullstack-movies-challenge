import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TVShow } from './TVShow';
import { Episode } from './Episode';

@Entity()
export class Season {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seasonNumber: number;

  // Many-to-One: each Season is for one TV Show
  @ManyToOne(() => TVShow, show => show.seasons)
  show: TVShow;

  // One-to-Many: a Season has multiple Episodes
  @OneToMany(() => Episode, episode => episode.season, { cascade: true })
  episodes: Episode[];
}
