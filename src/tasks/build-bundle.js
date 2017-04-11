// @flow
import { attachCompileListeners } from './attach-compile-listeners';
import webpack from 'webpack';

export function buildBundle(bundle: Object): Promise<*> {
  return new Promise((resolve, reject) => {
    const compiler = attachCompileListeners(webpack(bundle));

    compiler.run((error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  });
}
