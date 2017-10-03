// @flow
import { Log } from '../utils';
import paths from '../config/paths';
import rimraf from 'rimraf';

const log = new Log();

const clean: () => Promise<void> = () => (
  new Promise((resolve, reject) => {
    rimraf(paths.BUILD, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  })
);

export default async function (): Promise<void> {
  await clean();
  log.info(`Removed build path at "${paths.BUILD}".`);
}
