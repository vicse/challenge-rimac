import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GetMergedLambda } from './lambdas/get-merged-lambda';
import { ChallengeGateway } from './gateway/challenge-gateway';
import { CharactersTable } from './dynamodb/characters-table';
import { HistoryTable } from './dynamodb/history-table';

export class RimacChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const charactersTable = new CharactersTable(this);
    const historyTable = new HistoryTable(this);

    const getMergedLambda = new GetMergedLambda(this, { historyTable });

    new ChallengeGateway(this, { getMergedLambda });
  }
}
