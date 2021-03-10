import {getInput} from '@actions/core';
import {context} from '@actions/github';

export interface Inputs {
  name: string;
  path: string;
  version: string;
  docBuilderVersion: string;
  verbose: boolean;
  awsAccount: string;
  awsRole: string;
  awsSessionName: string;
}

export async function getInputs(): Promise<Inputs> {
  const inputs: Inputs = {
    name: getInput('artifact-name'),
    path: getInput('path'),
    version: getInput('version'),
    docBuilderVersion: getInput('doc-builder-version'),
    verbose: getInput('verbose') === 'true',
    awsAccount: getInput('aws-account'),
    awsRole: getInput('aws-role'),
    awsSessionName: getInput('aws-session-name')
  };

  if (inputs.name === '') {
    inputs.name = context.repo.repo;
  }

  if (inputs.version === '') {
    inputs.version = context.sha;
  }

  return inputs;
}
