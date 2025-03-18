import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

interface ChallengeGatewayParams {
  getMergedLambda: NodejsFunction;
  getHistoryLambda: NodejsFunction;
  createCharacterLambda: NodejsFunction;
}

export class ChallengeGateway extends Construct {
  constructor(scope: Construct, params: ChallengeGatewayParams) {
    super(scope, 'ChallengeGateway');

    const api = new apiGateway.RestApi(this, 'TransactionsApi', {
      restApiName: 'Rimac Challenge API',
      description: 'Backend NodeJS/AWS Challenge - API',
      deployOptions: {
        tracingEnabled: true,
      },
    });

    const mergedResource = api.root.addResource('fusionados');
    mergedResource.addMethod(
      'GET',
      new apiGateway.LambdaIntegration(params.getMergedLambda, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      }),
    );

    const historyResource = api.root.addResource('historial');
    historyResource.addMethod(
      'GET',
      new apiGateway.LambdaIntegration(params.getHistoryLambda, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      }),
    );

    const storeResource = api.root.addResource('almacenar');
    storeResource.addMethod(
      'POST',
      new apiGateway.LambdaIntegration(params.createCharacterLambda, {
        requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      }),
    );
  }
}
