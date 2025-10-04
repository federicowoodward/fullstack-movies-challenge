export interface Director {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  year: number;
  director: Director;
  actors: Actor[];
}

export interface EpisodeDetail {
  id: number;
  title: string;
  episodeNumber: number;
  season: {
    id: number;
    seasonNumber: number;
    show: {
      id: number;
      title: string;
    };
  };
  director: Director;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
