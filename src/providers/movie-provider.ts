import {
  ITheMovieApiDirectorResponse,
  ITheMovieApiResponse,
} from './interfaces/movie-api-response';
import axios from 'axios';
import { getEnv } from '../utils/envs';
import { getFromCache, saveToCache } from '../repositories/cache-repository';

export const getDirector = async (
  name: string,
): Promise<ITheMovieApiDirectorResponse> => {
  const url = getEnv('MOVIE_API_BASE_URL');
  const cacheKey = `${url}/search/person?query=${encodeURIComponent(name)}`;

  const cachedData = await getFromCache(cacheKey);
  if (cachedData) return cachedData;

  const resp = await axios.get<ITheMovieApiResponse>(cacheKey, {
    params: { api_key: getEnv('MOVIE_API_KEY'), query: name },
  });

  await saveToCache(cacheKey, resp.data.results[0]);

  return resp.data.results[0];
};
