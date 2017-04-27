const path = require('path');

module.exports = {
  extends: [
    '@keenai/keenai',
    '@keenai/keenai/flowtype',
  ],
  rules: {
    'no-console': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [
          path.resolve(__dirname, 'src'),
        ],
      },
    },
  },
}
