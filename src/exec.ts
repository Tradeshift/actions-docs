import {ExecOptions, exec as actionsExec} from '@actions/exec';
import {debug} from '@actions/core';

export interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
}

export async function exec(
  command: string,
  args: string[] = [],
  silent: boolean,
  stdin?: string
): Promise<ExecResult> {
  let stdout = '';
  let stderr = '';

  debug(`Executing: ${command} ${args.join(' ')}`);
  if (stdin) {
    debug(`Stdin: ${stdin}`);
  }

  const options: ExecOptions = {
    silent,
    ignoreReturnCode: true,
    input: Buffer.from(stdin || '')
  };
  options.listeners = {
    stdout: (data: Buffer) => {
      stdout += data.toString();
    },
    stderr: (data: Buffer) => {
      stderr += data.toString();
    }
  };

  const returnCode: number = await actionsExec(command, args, options);

  return {
    success: returnCode === 0,
    stdout: stdout.trim(),
    stderr: stderr.trim()
  };
}
