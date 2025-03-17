#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RimacChallengeStack } from '../lib/rimac-challenge-stack';

const app = new cdk.App();
new RimacChallengeStack(app, 'RimacChallengeStack', {});
