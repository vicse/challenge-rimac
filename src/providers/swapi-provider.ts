import { ISwapiFilmResponse } from './interfaces/swapi-film-response';
import axios from 'axios';

export const getFilm = async (id: number): Promise<ISwapiFilmResponse> => {
  const url = 'https://swapi.dev/api';
  const resp = await axios.get(`${url}/films/${id}`);
  return resp.data;
};
