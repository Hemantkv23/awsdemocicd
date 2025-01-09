import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

     // Retrieve the GitHub token stored in AWS Secrets Manager
     const githubToken = secretsmanager.Secret.fromSecretNameV2(
      this,
      'GithubToken',
      'github-token' // Name of the secret you stored in Secrets Manager
    );

    //AWS CICD

    const democicdpipeline = new CodePipeline(this, 'demopipeline', {

      synth: new ShellStep('Synth', {
        // Use a connection created using the AWS console to authenticate to GitHub
        // Other sources are available.
        input: CodePipelineSource.gitHub('Hemantkv23/awsdemocicd', 'main',{
          authentication: githubToken.secretValue // Use the secret value for authentication
        } ),
        
        commands: [
          'npm ci',
          'npm run build',
          'npm cdk synth',
        ],
      }),
    });

  }
}
