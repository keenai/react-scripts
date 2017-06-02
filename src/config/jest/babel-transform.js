// @flow
import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
  presets: [
    ['@keenai/keenai', {
      modules: 'commonjs',
      targets: {
        node: 'current',
      },
      useBuiltIns: true,
    }],
  ],
});
