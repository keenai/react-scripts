// @flow
import { Log } from '../utils';
import { transformFile } from 'babel-core';
import glob from 'glob';
import paths from '../config/paths';

const log = new Log();

const getFilesToExtract: () => Promise<Array<string>> = () => (
  new Promise((resolve, reject) => (
    glob(`${paths.SOURCE}/**/*.jsx`, (error, files) => (error ? reject(error) : resolve(files)))
  ))
);

const extractMessagesFromFile: (files: Array<string>) => Promise<Array<string>> = (files) => (
  Promise.all(
    files.map((file) => (
      new Promise((resolve, reject) => (
        transformFile(file, (error, result) => (error ? reject(error) : resolve(result)))
      ))
    )),
  )
);

export const extractMessages: () => Promise<void> = () => (
  getFilesToExtract()
    .then(extractMessagesFromFile)
    .then((files) => log.info(`Extracted messages from ${files.length} files.`))
);
