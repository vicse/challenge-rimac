import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { Character } from '../entities/character';
import { createNewCharacterService } from '../services/character-service';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const character = parseAndValidate(event);
    await createNewCharacterService(character);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Character created with success`,
      }),
    };
  } catch (error: any) {
    console.error('Error :', error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};

function parseAndValidate(event: APIGatewayProxyEvent): Character {
  if (!event.body) throw new Error('Invalid input');

  const body = JSON.parse(event.body);
  if (!body.name || !body.image_url || !body.film_name)
    throw new Error('Invalid input');

  return body;
}
