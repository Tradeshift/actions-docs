import {which} from '@actions/io';
import * as exec from '@actions/exec';
async function getCLI(): Promise<string> {
  return which('aws', true);
}

export interface AWSCreds {
  accessKeyID: string;
  accessKey: string;
  sessionID: string;
}

export async function getAWSCreds(
  awsAccount: string,
  awsRole: string,
  awsSessionName: string
): Promise<AWSCreds> {
  const cli = await getCLI();
  const res = await exec.getExecOutput(
    cli,
    [
      'sts',
      'assume-role',
      '--role-arn',
      `arn:aws:iam::${awsAccount}:role/${awsRole}`,
      '--role-session-name',
      `${awsSessionName}`
    ],
    {silent: true}
  );
  if (res.exitCode) {
    throw new Error(res.stderr);
  }

  const output = JSON.parse(res.stdout);
  const result: AWSCreds = {
    accessKey: output.Credentials.SecretAccessKey,
    accessKeyID: output.Credentials.AccessKeyId,
    sessionID: output.Credentials.SessionToken
  };

  return result;
}
