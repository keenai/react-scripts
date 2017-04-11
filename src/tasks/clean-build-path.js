// @flow
import { Log } from '../utils';
import paths from '../config/paths';
import rimraf from 'rimraf';

const log = new Log();

export function cleanBuildPath(): Promise<*> {
  return new Promise((resolve, reject) => {
    rimraf(paths.BUILD, (error) => {
      if (error) {
        return reject(error);
      }

      log.info(`Removed build path at "${paths.BUILD}".`);

      return resolve();
    });
  });
}
