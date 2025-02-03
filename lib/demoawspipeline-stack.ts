import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { SecretValue } from 'aws-cdk-lib/core';
import { pipelineAppStage } from './demoawspipeline-app-stack';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get GitHub token from AWS Secrets Manager
    const gitHubAccessToken = SecretValue.secretsManager('myGitHubToken3');

    // AWS CI/CD Pipeline
    const democicdpipeline = new CodePipeline(this, 'demopipeline', {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Hemantkv23/awsdemocicd', 'main', {
          authentication: gitHubAccessToken, // Pass the token here
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    const testingStage = democicdpipeline.addStage(new pipelineAppStage(this, 'test', {
      env: {account: '242201272000', region: 'ap-south-1'}
    }));

    testingStage.addPost(new ManualApprovalStep('approval'));

    const prodStage = democicdpipeline.addStage(new pipelineAppStage(this, 'prod', {
      env: {account: '242201272000', region: 'ap-south-1'}
    }));


  }
}
