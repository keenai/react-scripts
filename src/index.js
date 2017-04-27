// @flow
import fs from 'fs';
import paths from './config/paths';
import webpackConfig from './config/webpack/webpack.config';
import webpackConfigClient from './config/webpack/webpack.config.client';
import webpackConfigServer from './config/webpack/webpack.config.server';

type BundleName = 'client' | 'server';

type Manifest = {
  [string]: string,
};

type WebpackConfig = {
  [string]: mixed,
};

export default {
  getBuildPath(): string {
    return paths.BUILD;
  },

  getChunkManifest(): Manifest | void {
    if (!fs.existsSync(paths.CHUNK_MANIFEST_JSON)) {
      return undefined;
    }

    return JSON.parse(
      fs.readFileSync(paths.CHUNK_MANIFEST_JSON).toString('utf8'),
    );
  },

  getManifest(): Manifest | void {
    if (!fs.existsSync(paths.MANIFEST_JSON)) {
      return undefined;
    }

    return JSON.parse(
      fs.readFileSync(paths.MANIFEST_JSON).toString('utf8'),
    );
  },

  getPublicPath(): string {
    return paths.PUBLIC;
  },

  getWebpackConfig(name?: BundleName): WebpackConfig {
    switch (name) {
      case 'client':
        return webpackConfigClient;
      case 'server':
        return webpackConfigServer;
      default:
        return webpackConfig;
    }
  },
};
