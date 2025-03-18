import { Character } from '../entities/character';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { getEnv } from '../utils/envs';
import { randomUUID } from 'crypto';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const CHARACTERS_TABLE_NAME: string = getEnv('CHARACTERS_TABLE');
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client, {});

export const createNewCharacter = async (
  character: Character,
): Promise<void> => {
  const command = new PutItemCommand({
    TableName: CHARACTERS_TABLE_NAME,
    Item: marshall({
      ...character,
      id: randomUUID(),
    }),
  });

  await client.send(command);
};

export const getCharacterByFilm = async (
  filmName: string,
): Promise<Character[]> => {
  const command = new QueryCommand({
    TableName: CHARACTERS_TABLE_NAME,
    IndexName: 'FILM_NAME_INDEX',
    KeyConditionExpression: 'film_name = :filmName',
    ExpressionAttributeValues: { ':filmName': { S: filmName } },
  });

  const result = await docClient.send(command);

  return (result.Items ?? []).map((item) => unmarshall(item) as Character);
};
