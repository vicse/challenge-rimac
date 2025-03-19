import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import {
  createNewCharacter,
  getCharacterByFilm,
} from '../../src/repositories/character-repository';
import { Character } from '../../src/entities/character';
import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

jest.mock('../../src/utils/envs', () => ({
  getEnv: jest.fn().mockReturnValue('CHARACTERS_TABLE'),
}));

const dynamoDBMock = mockClient(DynamoDBClient);
const docClientMock = mockClient(DynamoDBDocumentClient);

describe('character-repository.ts', () => {
  beforeEach(() => {
    dynamoDBMock.reset();
    docClientMock.reset();
  });

  it('should create a new character', async () => {
    const character = {
      name: 'Luke Skywalker',
      image_url:
        'https://upload.wikimedia.org/wikipedia/commons/0/05/R2-D2_-_Genuine_Movie_Star.jpg',
      film_name: 'Return of the Jedi',
    };
    dynamoDBMock.on(PutItemCommand).resolves({});
    await createNewCharacter(character as Character);

    const calls = dynamoDBMock.commandCalls(PutItemCommand);
    expect(calls.length).toBe(1);
  });

  it('should get characters by film', async () => {
    docClientMock.on(QueryCommand).resolves({
      Items: [
        marshall({
          id: '1',
          name: 'Luke Skywalker',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/R2-D',
          film_name: 'Return of the Jedi',
        }),
        marshall({
          id: '2',
          name: 'Luke Skywalker 2',
          image_url:
            'https://upload.wikimedia.org/wikipedia/commons/0/05/R2-D2',
          film_name: 'Return of the Jedi',
        }),
      ],
    });

    const characters = await getCharacterByFilm('Return of the Jedi');

    expect(characters.length).toBe(2);
    expect(characters[0]).toHaveProperty('id');
    expect(characters[0]).toHaveProperty('name');
    expect(characters[0]).toHaveProperty('image_url');
    expect(characters[0]).toHaveProperty('film_name');
  });
});
