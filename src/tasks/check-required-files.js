// @flow
import { Log } from '../utils';
import check from 'react-dev-utils/checkRequiredFiles';

const log = new Log();

export function checkRequiredFiles(requiredFiles: Array<string>): Promise<*> {
  return new Promise((resolve, reject) => {
    if (check(requiredFiles)) {
      log.info('Required files found.');

      return resolve();
    }

    return reject(
      new Error('Missing required files.'),
    );
  });
}
