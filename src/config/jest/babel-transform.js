// @flow
import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
  presets: [
    '@keenai/core',
  ],
});
