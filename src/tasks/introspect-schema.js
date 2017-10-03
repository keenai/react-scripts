// @flow
import { Log } from '../utils';
import path from 'path';
import paths from '../config/paths';
import spawn from 'cross-spawn';

const apolloBinary = path.resolve(paths.NODE_MODULES_SELF, '.bin/apollo-codegen');
const log = new Log();

const generate: (
  glob: string,
  schema: string,
  output: string,
  ...rest: Array<void>
) => Promise<void> = (
  glob,
  schema,
  output,
) => (
  new Promise((resolve, reject) => {
    try {
      const result = spawn.sync(
        apolloBinary,
        ['generate', glob, '--schema', schema, '--output', output, '--target', 'flow'],
        { stdio: 'inherit' },
      );

      resolve(result);
    } catch (error) {
      reject(error);
    }
  })
);

export default async function (glob: string, schema: string, output: string): Promise<void> {
  log.info(`Generating flow typings for ${glob}.`);
  await generate(glob, schema, output);
  log.info(`Flow definitions saved to "${output}".`);
}
