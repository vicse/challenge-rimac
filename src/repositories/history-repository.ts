import { Film } from '../entities/film';
import { getEnv } from '../utils/envs';
import { randomUUID } from 'crypto';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const HISTORY_TABLE_NAME: string = getEnv('HISTORY_TABLE');
const client = new DynamoDBClient();

export const createHistory = async (film: Film): Promise<void> => {
  const command = new PutItemCommand({
    TableName: HISTORY_TABLE_NAME,
    Item: {
      id: { S: randomUUID() },
      request: { S: JSON.stringify(film) },
      request_date: { N: `${Date.now()}` },
    },
  });

  await client.send(command);
};

// export const getHistory = () => {
//
// }
