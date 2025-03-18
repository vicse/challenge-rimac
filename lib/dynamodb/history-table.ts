import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class HistoryTable extends Table {
  constructor(scope: Construct) {
    super(scope, 'HISTORY_TABLE', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'request_date', type: AttributeType.NUMBER },
    });

    this.addGlobalSecondaryIndex({
      indexName: 'STATUS_INDEX',
      partitionKey: { name: 'status', type: AttributeType.STRING },
      sortKey: { name: 'request_date', type: AttributeType.NUMBER },
    });
  }
}
