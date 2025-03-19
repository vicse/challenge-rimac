import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  createHistory,
  getHistory,
} from '../../src/repositories/history-repository';
import { Film } from '../../src/entities/film';
import { marshall } from '@aws-sdk/util-dynamodb';

jest.mock('../../src/utils/envs', () => ({
  getEnv: jest.fn().mockReturnValue('HISTORY_TABLE'),
}));

const dynamoDBMock = mockClient(DynamoDBClient);
const docClientMock = mockClient(DynamoDBDocumentClient);

describe('history-repository.ts', () => {
  beforeEach(() => {
    dynamoDBMock.reset();
    docClientMock.reset();
  });

  it('should create a new history', async () => {
    const film = {
      title: 'Return of the Jedi',
      opening_crawl:
        'Luke Skywalker has returned to his home planet of Tatooine',
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
      ],
    };
    dynamoDBMock.on(PutItemCommand).resolves({});

    await createHistory(film as Film);

    const calls = dynamoDBMock.commandCalls(PutItemCommand);
    expect(calls.length).toBe(1);
  });

  it('should get history successfully', async () => {
    docClientMock.on(QueryCommand).resolves({
      Items: [
        marshall({
          id: '40093fba-dd05-4f28-b0dc-3f556380f54c',
          request: JSON.stringify({
            title: 'The Empire Strikes Back',
            opening_crawl: 'It is a dark time for the Rebellion.',
            director_name: 'Irvin Kershner',
            producer: 'Gary Kurtz, Rick McCallum',
            director: {
              id: 10930,
              name: 'Irvin Kershner',
              image_url: '/imtFUtcASoh2e1Emtt62UuFkIWA.jpg',
              other_films: [
                'The Empire Strikes Back',
                'RoboCop 2',
                'Never Say Never Again',
              ],
            },
            characters: [],
          }),
          request_date: 1742338817831,
          status: 'active',
        }),
      ],
      Count: 1,
      LastEvaluatedKey: { id: { S: '40093fba-dd05-4f28-b0dc-3f556380f54c' } },
    });

    const history = await getHistory();

    expect(history).toHaveProperty('items');
    expect(history).toHaveProperty('count');
    expect(history).toHaveProperty('nextKey');
  });
});
