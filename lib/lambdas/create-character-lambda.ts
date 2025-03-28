import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';

interface CreateCharacterLambdaParams {
  charactersTable: Table;
}

export class CreateCharacterLambda extends NodejsFunction {
  constructor(scope: Construct, params: CreateCharacterLambdaParams) {
    super(scope, 'CreateCharacterLambda', {
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      memorySize: 256,
      timeout: Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: true,
      },
      entry: 'src/lambda/create-character-lambda.ts',
      handler: 'handler',
      tracing: Tracing.ACTIVE,
      environment: {
        CHARACTERS_TABLE: params.charactersTable.tableName,
      },
    });

    params.charactersTable.grantWriteData(this);

    this.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
    );
  }
}
