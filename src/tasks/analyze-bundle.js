// @flow
import fs from 'fs';
import paths from '../config/paths';
import webpack from 'webpack';

export function analyzeBundle(bundle: Object): Promise<*> {
  return new Promise((resolve, reject) => {
    webpack(bundle).run((error, stats) => {
      if (error) {
        return reject(error);
      }

      fs.writeFileSync(
        paths.STATS_FILE,
        JSON.stringify(stats.toJson('verbose'), null, 2),
      );

      return resolve();
    });
  });
}
