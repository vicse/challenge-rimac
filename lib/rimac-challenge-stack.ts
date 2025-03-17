import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GetMergedLambda } from './lambdas/get-merged-lambda';
import { ChallengeGateway } from './gateway/challenge-gateway';

export class RimacChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getMergedLambda = new GetMergedLambda(this);

    new ChallengeGateway(this, { getMergedLambda });
  }
}
