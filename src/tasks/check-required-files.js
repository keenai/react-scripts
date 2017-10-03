// @flow
import { Log } from '../utils';
import check from 'react-dev-utils/checkRequiredFiles';

const log = new Log();

export default async function (requiredFiles: Array<string>): Promise<void> {
  if (!check(requiredFiles)) {
    return Promise.reject(
      new Error('Missing required files.'),
    );
  }

  log.info('Required files found.');

  return Promise.resolve();
}
