import {which} from '@actions/io';
import {exec} from '@tradeshift/actions-exec';

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
  const res = await exec(
    cli,
    [
      'sts',
      'assume-role',
      '--role-arn',
      `arn:aws:iam::${awsAccount}:role/${awsRole}`,
      '--role-session-name',
      `${awsSessionName}`
    ],
    true
  );
  if (res.stderr !== '' && !res.success) {
    throw new Error(res.stderr);
  } else if (res.stderr !== '') {
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
