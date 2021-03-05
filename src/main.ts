import {getInputs} from './inputs';
import * as docs from './docs';

async function run(): Promise<void> {
  const inputs = await getInputs();
  docs.build(inputs);
}

run();
