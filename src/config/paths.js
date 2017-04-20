// @flow
import fs from 'fs';
import path from 'path';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath: string): string {
  return path.resolve(appDirectory, relativePath);
}

function resolveSelf(relativePath: string): string {
  return path.resolve(__dirname, '../', relativePath);
}

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.

// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders

// We will export `nodePaths` as an array of absolute paths.
// It will then be used by Webpack configs.
// Jest doesn’t need this because it already handles `NODE_PATH` out of the box.

// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter((folder) => !path.isAbsolute(folder))
  .map(resolveApp)
;

export default {
  APP_HTML: resolveApp('public/index.html'),
  ASSETS_FILE: resolveSelf('../build/assets.json'),
  BUILD: resolveApp('build'),
  BUILD_SELF: resolveSelf('../build'),
  CLIENT_ENTRY: resolveApp('src/client/index.js'),
  JEST_CONFIG: resolveSelf('../.jestconfig'),
  NODE_MODULES: resolveApp('node_modules'),
  NODE_MODULES_SELF: resolveSelf('../node_modules'),
  NODE_PATHS: nodePaths,
  PACKAGE_JSON: resolveApp('package.json'),
  PUBLIC: resolveApp('public'),
  SERVER_ENTRY: resolveApp('src/server/index.js'),
  SOURCE: resolveApp('src'),
};