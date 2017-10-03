// @flow
import { Log } from '../utils';
import { writeFile } from 'fs';
import webpack from 'webpack';

type Stats = Object;

const log = new Log();

const bundle: (config: Object) => Promise<Stats> = (config) => (
  new Promise((resolve, reject) => (
    webpack(config).run((error, stats) => {
      if (error) {
        return reject(error);
      }

      return resolve(stats);
    })
  ))
);

const writeStatsFile: (stats: Stats, filename: string) => Promise<void> = (stats, filename) => (
  new Promise((resolve, reject) => (
    writeFile(
      filename,
      JSON.stringify(stats.toJson('verbose'), null, 2),
      (error) => {
        if (error) {
          reject(error);
        }

        resolve();
      },
    )
  ))
);

export default async function (config: Object, filename: string): Promise<void> {
  log.info('Analyzing bundle.');
  const stats = await bundle(config);
  await writeStatsFile(stats, filename);
  log.info('Analysis complete.');
}
