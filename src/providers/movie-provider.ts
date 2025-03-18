import {
  ITheMovieApiDirectorResponse,
  ITheMovieApiResponse,
} from './interfaces/movie-api-response';
import axios from 'axios';
import { getEnv } from '../utils/envs';

export const getDirector = async (
  name: string,
): Promise<ITheMovieApiDirectorResponse> => {
  const url = 'https://api.themoviedb.org/3';
  const resp = await axios.get<ITheMovieApiResponse>(`${url}/search/person`, {
    params: { api_key: getEnv('MOVIE_API_KEY'), query: name },
  });
  return resp.data.results[0];
};
