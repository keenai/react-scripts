// @flow
import { attachCompileListeners } from '../utils';
import webpack from 'webpack';

const compile: (config: Object) => Promise<void> = (config) => (
  new Promise((resolve, reject) => {
    const compiler = attachCompileListeners(webpack(config));

    compiler.run((error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  })
);

export default async function (config: Object): Promise<void> {
  await compile(config);
}
