// @flow
import program from 'commander';

program
  .command('generate', 'generate master translation file', { isDefault: true, noHelp: true })
  .command('download', 'download translation files')
  .command('upload', 'upload master translation file')
  .parse(process.argv)
;
