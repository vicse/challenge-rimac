import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

interface GetMergedLambdaParams {
  historyTable: Table;
}

export class GetMergedLambda extends NodejsFunction {
  constructor(scope: Construct, params: GetMergedLambdaParams) {
    const movieApiKey = ssm.StringParameter.valueForStringParameter(
      scope,
      '/cdk-serverless-app/api-key-movie-db',
    );
    const baseUrlMovieApi = ssm.StringParameter.valueForStringParameter(
      scope,
      '/cdk-serverless-app/api-base-url-movie-db',
    );
    const baseUrlSwapiApi = ssm.StringParameter.valueForStringParameter(
      scope,
      '/cdk-serverless-app/api-base-url-swapi',
    );
    super(scope, 'GetMergedLambda', {
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      bundling: {
        minify: true,
        sourceMap: true,
      },
      entry: 'src/lambda/merged-lambda.ts',
      handler: 'handler',
      environment: {
        MOVIE_API_KEY: movieApiKey,
        MOVIE_API_BASE_URL: baseUrlMovieApi,
        SWAPI_BASE_URL: baseUrlSwapiApi,
        HISTORY_TABLE: params.historyTable.tableName,
      },
    });

    params.historyTable.grantWriteData(this);
  }
}
