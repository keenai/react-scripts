// @flow
import jest from 'jest-cli';

const argv = process.argv.slice(2);

// Watch by default unless in CI or running coverage
if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch');
}

jest.run(argv);
