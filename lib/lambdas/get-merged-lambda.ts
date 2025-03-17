import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class GetMergedLambda extends NodejsFunction {
  constructor(scope: Construct) {
    super(scope, 'GetMergedLambda', {
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      bundling: {
        minify: true,
        sourceMap: true,
      },
      entry: 'src/lambda/mergedLambda.ts',
      handler: 'handler',
      environment: {},
    });
  }
}
