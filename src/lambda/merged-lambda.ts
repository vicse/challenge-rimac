import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { getFilmService } from '../services/films-service';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const filmId = event.queryStringParameters?.filmId;
    if (!filmId) {
      throw new Error('filmId is required');
    }

    const film = await getFilmService(+filmId);
    return {
      statusCode: 200,
      body: JSON.stringify(film),
    };
  } catch (error: any) {
    console.error('Error :', error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
