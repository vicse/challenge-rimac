import { ISwapiFilmResponse } from './interfaces/swapi-film-response';
import axios from 'axios';
import { getEnv } from '../utils/envs';
import { getFromCache, saveToCache } from '../repositories/cache-repository';

export const getFilm = async (id: number): Promise<ISwapiFilmResponse> => {
  const url = getEnv('SWAPI_BASE_URL');
  const cacheKey = `${url}/films/${id}`;

  const cachedData = await getFromCache(cacheKey);
  if (cachedData) return cachedData;

  const resp = await axios.get(cacheKey);

  await saveToCache(cacheKey, resp.data);

  return resp.data;
};
