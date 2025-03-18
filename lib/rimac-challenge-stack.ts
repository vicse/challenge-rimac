import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  GetMergedLambda,
  CreateCharacterLambda,
  GetHistoryLambda,
} from './lambdas';
import { ChallengeGateway } from './gateway/challenge-gateway';
import { CacheTable, CharactersTable, HistoryTable } from './dynamodb';

export class RimacChallengeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const charactersTable = new CharactersTable(this);
    const historyTable = new HistoryTable(this);
    const cacheTable = new CacheTable(this);

    const getMergedLambda = new GetMergedLambda(this, {
      historyTable,
      charactersTable,
      cacheTable,
    });
    const getHistoryLambda = new GetHistoryLambda(this, { historyTable });
    const createCharacterLambda = new CreateCharacterLambda(this, {
      charactersTable,
    });

    new ChallengeGateway(this, {
      getMergedLambda,
      getHistoryLambda,
      createCharacterLambda,
    });
  }
}
