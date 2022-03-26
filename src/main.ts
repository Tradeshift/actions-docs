import * as core from '@actions/core';
import {getInputs} from './inputs';
import * as docs from './docs';

async function run(): Promise<void> {
  try {
    const inputs = await getInputs();
    return docs.build(inputs);
  } catch (err) {
    core.error(err);
    process.exit(1);
  }
}

run();
