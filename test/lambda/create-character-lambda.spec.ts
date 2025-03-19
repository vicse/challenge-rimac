import { handler } from '../../src/lambda/create-character-lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';
import * as CharacterService from '../../src/services/character-service';

jest.mock('../../src/utils/envs', () => ({
  getEnv: jest.fn().mockReturnValue('CHARACTERS_TABLE'),
}));

describe('create-character-lambda.ts', () => {
  const event = {
    body: JSON.stringify({
      name: 'R2-D2',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/0/05/R2-D2_-_Genuine_Movie_Star.jpg',
      film_name: 'Return of the Jedi',
    }),
  } as APIGatewayProxyEvent;

  it('should create a new character', async () => {
    jest
      .spyOn(CharacterService, 'createNewCharacterService')
      .mockResolvedValue(undefined);

    const mockCallback = jest.fn() as unknown as Callback;

    const response = (await handler(
      event,
      {} as Context,
      mockCallback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('Character created with success');
  });

  it('should return 500 if createNewCharacterService throws an error', async () => {
    jest
      .spyOn(CharacterService, 'createNewCharacterService')
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
