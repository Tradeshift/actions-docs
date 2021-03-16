import {Inputs} from './inputs';
import {exec} from '@tradeshift/actions-exec';
import * as path from 'path';
import {getAWSCreds} from './aws';

export async function build(inputs: Inputs): Promise<void> {
  const currentDir = await exec('pwd', [], false);
  if (!currentDir.success) {
    throw new Error(`unable to fetch current dir path: ${currentDir.stderr}`);
  }

  const awsCreds = await getAWSCreds(
    inputs.awsAccount,
    inputs.awsRole,
    inputs.awsSessionName
  );

  const dockerParams = [
    'run',
    '--rm',
    '--volume',
    `${currentDir.stdout}:/temp`,
    '--env',
    `AWS_ACCESS_KEY_ID=${awsCreds.accessKeyID}`,
    '--env',
    `AWS_SECRET_ACCESS_KEY=${awsCreds.accessKey}`,
    '--env',
    `AWS_SESSION_TOKEN=${awsCreds.sessionID}`,
    `eu.gcr.io/tradeshift-base/doc-builder:${inputs.docBuilderVersion}`,
    `${path.join('/temp', inputs.path)}`,
    '--name',
    `${inputs.name}`,
    '--version',
    `${inputs.version}`,
    '--push'
  ];

  if (inputs.verbose) {
    dockerParams.push('--verbose');
  }

  const result = await exec('docker', dockerParams, true);
  if (!result.success) {
    throw new Error(`unable to upload docs: ${result.stderr}`);
  }
}
