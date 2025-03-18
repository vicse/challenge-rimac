import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { getHistoryService } from '../services/history-service';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { limit, lastKey } = getQueryParams(event);

    const history = await getHistoryService(limit, lastKey);
    return {
      statusCode: 200,
      body: JSON.stringify(history),
    };
  } catch (error: any) {
    console.error('Error :', error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};

const getQueryParams = (event: APIGatewayProxyEvent) => {
  const limit = Number(event.queryStringParameters?.limit);
  const lastKey = event.queryStringParameters?.lastKey;
  return { limit, lastKey };
};
