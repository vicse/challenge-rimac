import * as HistoryService from '../../src/services/history-service';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';
import { handler } from '../../src/lambda/get-history-lambda';

jest.mock('../../src/utils/envs', () => ({
  getEnv: jest.fn().mockReturnValue('HISTORY_TABLE'),
}));

describe('get-history-lambda.spec.ts', () => {
  const event = {
    queryStringParameters: {
      limit: '1',
    },
  } as unknown as APIGatewayProxyEvent;

  it('should get history info', async () => {
    jest.spyOn(HistoryService, 'getHistoryService').mockResolvedValue({
      items: [
        {
          id: '40093fba-dd05-4f28-b0dc-3f556380f54c',
          request: [
            {
              title: 'The Empire Strikes Back',
              opening_crawl:
                'It is a dark time for the\r\nRebellion. Although the Death\r\nStar has been destroyed,\r\nImperial troops have driven the\r\nRebel forces from their hidden\r\nbase and pursued them across\r\nthe galaxy.\r\n\r\nEvading the dreaded Imperial\r\nStarfleet, a group of freedom\r\nfighters led by Luke Skywalker\r\nhas established a new secret\r\nbase on the remote ice world\r\nof Hoth.\r\n\r\nThe evil lord Darth Vader,\r\nobsessed with finding young\r\nSkywalker, has dispatched\r\nthousands of remote probes into\r\nthe far reaches of space....',
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
            },
          ],
          request_date: 1742338817831,
        },
      ],
      count: 1,
      nextKey: 'ac74e164-88bf-4252-97f9-edd8e5b35cf5',
    });

    const mockCallback = jest.fn() as unknown as Callback;

    const response = (await handler(
      event,
      {} as Context,
      mockCallback,
    )) as APIGatewayProxyResult;

    const responseBody = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(responseBody.items)).toBeTruthy();
    expect(responseBody).toHaveProperty('count');
    expect(responseBody).toHaveProperty('nextKey');
  });
});
