import { getFilm } from '../providers/swapi-provider';
import {
  directorDtoToEntityMapper,
  filmDtoToEntityMapper,
} from '../mappers/film-mapper';
import { Film } from '../entities/film';
import { getDirector } from '../providers/movie-provider';
import { createHistory } from '../repositories/history-repository';
import { getCharacterByFilm } from '../repositories/character-repository';

export const getFilmService = async (id: number): Promise<Film> => {
  const filmApi = await getFilm(id);
  const filmEntity = filmDtoToEntityMapper(filmApi);
  const [director, characters] = await Promise.all([
    getDirector(filmApi.director),
    getCharacterByFilm(filmApi.title),
  ]);
  filmEntity.director = directorDtoToEntityMapper(director);
  filmEntity.characters = characters;
  console.log(filmEntity);
  await createHistory(filmEntity);
  return filmEntity;
};
