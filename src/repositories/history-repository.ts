import { Film } from '../entities/film';
import { getEnv } from '../utils/envs';
import { randomUUID } from 'crypto';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { HistoryItem } from '../entities/history';
import { HistoryResponse } from '../interfaces/history-response';

const HISTORY_TABLE_NAME: string = getEnv('HISTORY_TABLE');
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client, {});

const ACTIVE_STATUS = 'active';

export const createHistory = async (film: Film): Promise<void> => {
  const command = new PutItemCommand({
    TableName: HISTORY_TABLE_NAME,
    Item: {
      id: { S: randomUUID() },
      request: { S: JSON.stringify(film) },
      request_date: { N: `${Date.now()}` },
      status: { S: ACTIVE_STATUS },
    },
  });

  await client.send(command);
};

export const getHistory = async (
  limit?: number,
  lastKey?: string,
): Promise<HistoryResponse> => {
  const command = new QueryCommand({
    TableName: HISTORY_TABLE_NAME,
    IndexName: 'STATUS_INDEX',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': { S: ACTIVE_STATUS } },
    ScanIndexForward: false,
    Limit: limit || 5,
    ExclusiveStartKey: lastKey ? { id: { S: lastKey } } : undefined,
  });

  const response = await docClient.send(command);

  const items = (response.Items ?? []).map((item) => {
    const parsed = unmarshall(item);
    return {
      ...parsed,
      request: JSON.parse(parsed.request),
    } as HistoryItem;
  });

  return {
    items,
    count: response.Count,
    nextKey: response.LastEvaluatedKey ? response.LastEvaluatedKey.id.S : null,
  };
};
