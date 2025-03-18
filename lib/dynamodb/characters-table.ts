import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class CharactersTable extends Table {
  constructor(scope: Construct) {
    super(scope, 'CHARACTERS_TABLE', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    this.addGlobalSecondaryIndex({
      indexName: 'FILM_NAME_INDEX',
      partitionKey: { name: 'film_name', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });
  }
}
