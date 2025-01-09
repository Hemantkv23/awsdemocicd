import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import { pipeline } from 'stream';

export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //AWS CICD

    const democicdpipeline = new CodePipeline(this, 'demopipeline', {

      synth: new ShellStep('Synth', {
        // Use a connection created using the AWS console to authenticate to GitHub
        // Other sources are available.
        input: CodePipelineSource.gitHub('Hemantkv23/awsdemocicd', 'main' ),
        commands: [
          'npm ci',
          'npm run build',
          'npm cdk synth',
        ],
      }),
    });

  }
}
