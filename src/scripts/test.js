// @flow
import jest from 'jest-cli';
import paths from '../config/paths';

const argv = process.argv.slice(2);

// Run the suite with our opinionated config.
argv.push(`--config=${paths.JEST_CONFIG}`);

// Watch by default unless in CI or running coverage
if (!process.env.CI && !argv.includes('--coverage')) {
  argv.push('--watch');
}

jest.run(argv);
