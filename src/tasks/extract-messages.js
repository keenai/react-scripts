// @flow
import { Log } from '../utils';
import paths from '../config/paths';
import spawn from 'cross-spawn';

const log = new Log();

const transformSource: () => Promise<void> = () => {
  try {
    spawn.sync(
      `${paths.NODE_MODULES_SELF}/.bin/babel`,
      [paths.SOURCE, '--out-dir', paths.BUILD, '--quiet'],
      { stdio: 'inherit' },
    );
  } catch (e) {
    return Promise.reject(e);
  }

  return Promise.resolve();
};

export default async function (): Promise<void> {
  log.info('Extracting messages from source.');

  return transformSource()
    .then(() => log.info('Messages extracted.'))
  ;
}
