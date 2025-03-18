import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class CacheTable extends Table {
  constructor(scope: Construct) {
    super(scope, 'API_CACHE_TABLE', {
      partitionKey: { name: 'cacheKey', type: AttributeType.STRING },
      timeToLiveAttribute: 'expiresAt',
    });
  }
}
