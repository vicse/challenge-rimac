import { Director, Film } from '../entities/film';
import { ISwapiFilmResponse } from '../providers/interfaces/swapi-film-response';
import { ITheMovieApiDirectorResponse } from '../providers/interfaces/movie-api-response';

export const filmDtoToEntityMapper = (dto: ISwapiFilmResponse): Film => {
  return {
    title: dto.title,
    opening_crawl: dto.opening_crawl,
    director_name: dto.director,
    producer: dto.producer,
  };
};

export const directorDtoToEntityMapper = (
  dto: ITheMovieApiDirectorResponse,
): Director => {
  return {
    id: dto.id,
    name: dto.name,
    image_url: dto.profile_path,
    other_films: dto.known_for.map((f) => f.title),
  };
};
