// @flow
import { log } from './log';
import check from 'react-dev-utils/checkRequiredFiles';

export function checkRequiredFiles(requiredFiles: Array<string>): Promise<*> {
  return new Promise((resolve, reject) => {
    if (check(requiredFiles)) {
      log('Validated required files exist.');

      return resolve();
    }

    return reject();
  });
}
