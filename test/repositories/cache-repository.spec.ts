import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  getFromCache,
  saveToCache,
} from '../../src/repositories/cache-repository';
import { marshall } from '@aws-sdk/util-dynamodb';

jest.mock('../../src/utils/envs', () => ({
  getEnv: jest.fn().mockReturnValue('CACHE_TABLE'),
}));

const dynamoDBMock = mockClient(DynamoDBClient);

describe('cache-repository.ts', () => {
  beforeEach(() => {
    dynamoDBMock.reset();
  });

  it('should get cache item from dynamoDB', async () => {
    const dto = { id: '123', name: 'John Doe' };
    dynamoDBMock.on(GetItemCommand).resolvesOnce({
      Item: marshall({ cacheKey: 'test', data: JSON.stringify(dto) }),
    });
    const item = await getFromCache('test');
    expect(item).toEqual(dto);
  });

  it('should create item in dynamoDB', async () => {
    const dto = { id: '123', name: 'John Doe' };
    dynamoDBMock.on(PutItemCommand).resolves({});
    await saveToCache('test', dto);

    const calls = dynamoDBMock.commandCalls(PutItemCommand);
    expect(calls.length).toBe(1);
    expect(calls[0].args[0].input).toMatchObject({
      TableName: 'CACHE_TABLE',
      Item: expect.objectContaining(
        marshall({
          cacheKey: 'test',
          data: JSON.stringify(dto),
        }),
      ),
    });
  });
});
