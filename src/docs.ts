import {Inputs} from './inputs';
import {exec} from '@tradeshift/actions-exec';
import * as path from 'path';
import * as core from '@actions/core';

export async function build(inputs: Inputs): Promise<void> {
  const currentDir = await exec('pwd', [], false);
  if (!currentDir.success) {
    throw new Error(`unable to fetch current dir path: ${currentDir.stderr}`);
  }

  const dockerParams = [
    'run',
    '--rm',
    '--volume',
    `${currentDir.stdout}:/temp`,
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

  core.info('docker params');
  core.info(dockerParams.toString());

  const result = await exec('docker', dockerParams, false);
  if (!result.success) {
    throw new Error(`unable to upload docs: ${result.stderr}`);
  }
}
