import { Character } from './character';

export interface Film {
  title: string;
  opening_crawl: string;
  director_name: string;
  producer: string;
  director?: Director;
  characters?: Character[];
}

export interface Director {
  id: number;
  name: string;
  image_url: string;
  other_films: string[];
}
