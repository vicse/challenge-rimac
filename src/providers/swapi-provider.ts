import { ISwapiFilmResponse } from './interfaces/swapi-film-response';
import axios from 'axios';
import { getEnv } from '../utils/envs';

export const getFilm = async (id: number): Promise<ISwapiFilmResponse> => {
  const url = getEnv('SWAPI_BASE_URL');
  const resp = await axios.get(`${url}/films/${id}`);
  return resp.data;
};
