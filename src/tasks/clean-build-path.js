// @flow
import { log } from './log';
import paths from '../config/paths';
import rimraf from 'rimraf';

export function cleanBuildPath(): Promise<*> {
  return new Promise((resolve, reject) => {
    rimraf(paths.BUILD, (error) => {
      if (error) {
        return reject(error);
      }

      log(`Removed build path at "${paths.BUILD}"`);

      return resolve();
    });
  });
}
