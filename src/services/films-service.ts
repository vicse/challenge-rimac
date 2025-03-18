import { getFilm } from '../providers/swapi-provider';
import {
  directorDtoToEntityMapper,
  filmDtoToEntityMapper,
} from '../mappers/film-mapper';
import { Film } from '../entities/film';
import { getDirector } from '../providers/movie-provider';

export const getFilmService = async (id: number): Promise<Film> => {
  const filmApi = await getFilm(id);
  const director = await getDirector(filmApi.director);
  const filmEntity = filmDtoToEntityMapper(filmApi);
  filmEntity.director = directorDtoToEntityMapper(director);
  console.log(filmEntity);
  return filmEntity;
};
