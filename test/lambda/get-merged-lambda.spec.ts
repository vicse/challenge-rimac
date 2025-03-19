import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';
import * as FilmService from '../../src/services/films-service';
import { handler } from '../../src/lambda/get-merged-lambda';
import { getEnv } from '../../src/utils/envs';

jest.mock('../../src/utils/envs');

(getEnv as jest.Mock)
  .mockImplementationOnce(() => 'SWAPI_BASE_URL')
  .mockImplementationOnce(() => 'CACHE_TABLE')
  .mockImplementationOnce(() => 'MOVIE_API_KEY')
  .mockImplementationOnce(() => 'MOVIE_API_BASE_URL')
  .mockImplementationOnce(() => 'CHARACTERS_TABLE')
  .mockImplementationOnce(() => 'HISTORY_TABLE');

describe('get-merged-lambda.ts', () => {
  const event = {
    queryStringParameters: {
      filmId: 'id',
    },
  } as unknown as APIGatewayProxyEvent;

  it('should get a merged info thirty party APIs', async () => {
    jest.spyOn(FilmService, 'getFilmService').mockResolvedValue({
      title: 'Return of the Jedi',
      opening_crawl: 'Luke Skywalker has returned',
      director_name: 'Richard Marquand',
      producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
      director: {
        id: 19800,
        name: 'Richard Marquand',
        image_url: '/eEalDQpLsXJqejPDQ3MWGe95UHT.jpg',
        other_films: ['Return of the Jedi', 'Jagged Edge', 'Eye of the Needle'],
      },
      characters: [
        {
          image_url:
            'https://static.wikia.nocookie.net/esstarwars/images/d/d9/Luke-rotjpromo.jpg/revision/latest?cb=20071214134433',
          id: 'c808c1fd-4826-4fde-9faa-787547928b25',
          film_name: 'Return of the Jedi',
          name: 'Luke Skywalker',
        },
        {
          image_url:
            'https://upload.wikimedia.org/wikipedia/commons/0/05/R2-D2_-_Genuine_Movie_Star.jpg',
          id: '0d61acb5-f987-4572-bc18-fae7ee351ca5',
          film_name: 'Return of the Jedi',
          name: 'R2-D2',
        },
        {
          image_url:
            'https://lumiere-a.akamaihd.net/v1/images/c-3po-main_d6850e28.jpeg?region=176%2C0%2C951%2C536',
          id: 'c669e046-a19b-4553-b07c-5dee83033a2b',
          film_name: 'Return of the Jedi',
          name: 'C-3PO',
        },
      ],
    });

    const mockCallback = jest.fn() as unknown as Callback;

    const response = (await handler(
      event,
      {} as Context,
      mockCallback,
    )) as APIGatewayProxyResult;

    const mergedInfo = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(mergedInfo).toHaveProperty('title');
    expect(mergedInfo).toHaveProperty('director');
    expect(mergedInfo).toHaveProperty('characters');
  });

  it('should return 500 if getFilmService throws an error', async () => {
    jest
      .spyOn(FilmService, 'getFilmService')
      .mockRejectedValue(new Error('DynamoDB error'));

    const mockCallback = jest.fn() as unknown as Callback;

    const response = (await handler(
      event,
      {} as Context,
      mockCallback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('DynamoDB error');
  });
});
