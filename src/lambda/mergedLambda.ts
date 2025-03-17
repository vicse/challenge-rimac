import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      body: 'Hola Mundo',
    };
  } catch (error: any) {
    console.error('Error :', error);

    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
