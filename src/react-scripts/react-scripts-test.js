// @flow
import createJestConfig from '../utils/create-jest-config';
import jest from 'jest-cli';
import path from 'path';
import paths from '../config/paths';
import program from 'commander';

const argv = process.argv.slice(2);

program.parse(process.argv);

// Run the suite with our opinionated config.
argv.push(
  '--config',
  JSON.stringify(
    createJestConfig(path.dirname(paths.PACKAGE_JSON)),
  ),
);

// Watch by default unless in CI or running coverage
if (!process.env.CI && !argv.includes('--coverage')) {
  argv.push('--watch');
}

jest.run(argv);
