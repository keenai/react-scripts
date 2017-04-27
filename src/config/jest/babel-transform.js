// @flow
import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
  babelrc: false,
  presets: [
    ['@keenai/keenai', {
      modules: false,
    }],
  ],
});
