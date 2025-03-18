import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

interface GetMergedLambdaParams {
  historyTable: Table;
}

export class GetHistoryLambda extends NodejsFunction {
  constructor(scope: Construct, params: GetMergedLambdaParams) {
    super(scope, 'GetHistoryLambda', {
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      bundling: {
        minify: true,
        sourceMap: true,
      },
      entry: 'src/lambda/get-history-lambda.ts',
      handler: 'handler',
      tracing: Tracing.ACTIVE,
      environment: {
        HISTORY_TABLE: params.historyTable.tableName,
      },
    });

    params.historyTable.grantReadData(this);

    this.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
    );
  }
}
