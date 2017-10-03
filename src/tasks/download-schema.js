// @flow
import { Log } from '../utils';
import path from 'path';
import paths from '../config/paths';
import spawn from 'cross-spawn';

const apolloBinary = path.resolve(paths.NODE_MODULES_SELF, '.bin/apollo-codegen');
const log = new Log();

const download: (url: string, output: string) => Promise<void> = (url, output) => (
  new Promise((resolve, reject) => {
    try {
      const result = spawn.sync(
        apolloBinary,
        ['introspect-schema', url, '--output', output],
        { stdio: 'inherit' },
      );

      resolve(result);
    } catch (error) {
      reject(error);
    }
  })
);

export default async function (url: string, output: string): Promise<void> {
  log.info(`Introspecting ${url}.`);
  await download(url, output);
  log.info(`Schema file saved to "${output}".`);
}
