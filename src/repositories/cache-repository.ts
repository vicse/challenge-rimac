import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getEnv } from '../utils/envs';

const CACHE_TABLE_NAME: string = getEnv('CACHE_TABLE');
const client = new DynamoDBClient();

export const getFromCache = async (cacheKey: string) => {
  const command = new GetItemCommand({
    TableName: CACHE_TABLE_NAME,
    Key: { cacheKey: { S: cacheKey } },
  });

  const response = await client.send(command);
  return response.Item ? JSON.parse(response.Item.data.S as string) : null;
};

export const saveToCache = async (cacheKey: string, data: any) => {
  const ttl = Math.floor(Date.now() / 1000) + 1800; // 30 min in seconds

  const command = new PutItemCommand({
    TableName: CACHE_TABLE_NAME,
    Item: {
      cacheKey: { S: cacheKey },
      data: { S: JSON.stringify(data) },
      expiresAt: { N: ttl.toString() },
    },
  });

  await client.send(command);
};
