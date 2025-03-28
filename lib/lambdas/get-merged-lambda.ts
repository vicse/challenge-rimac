import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';

interface GetMergedLambdaParams {
  historyTable: Table;
  charactersTable: Table;
  cacheTable: Table;
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
      architecture: Architecture.ARM_64,
      memorySize: 256,
      timeout: Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: true,
      },
      entry: 'src/lambda/get-merged-lambda.ts',
      handler: 'handler',
      tracing: Tracing.ACTIVE,
      environment: {
        MOVIE_API_KEY: movieApiKey,
        MOVIE_API_BASE_URL: baseUrlMovieApi,
        SWAPI_BASE_URL: baseUrlSwapiApi,
        HISTORY_TABLE: params.historyTable.tableName,
        CHARACTERS_TABLE: params.charactersTable.tableName,
        CACHE_TABLE: params.cacheTable.tableName,
      },
    });

    params.charactersTable.grantReadData(this);
    params.historyTable.grantWriteData(this);
    params.cacheTable.grantReadWriteData(this);

    this.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
    );
  }
}
