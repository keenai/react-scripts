// @flow
import { Log } from '../utils';
import { readFile, writeFile } from 'fs';
import { stringify } from 'csv-string';
import glob from 'glob';
import paths from '../config/paths';

type Message = {
  id: string,
  description: string,
  defaultMessage: string,
};

const log = new Log();

const getMessageFiles: () => Promise<Array<string>> = () => (
  new Promise((resolve, reject) => (
    glob(`${paths.TRANSLATIONS}/**/*.json`, (error, files) => (error ? reject(error) : resolve(files)))
  ))
);

const parseMessages: (files: Array<string>) => Promise<Array<Array<Message>>> = (files) => (
  Promise.all(
    files.map((file) => new Promise((resolve, reject) => (
      readFile(
        file,
        'utf8',
        (error, data) => (error ? reject(error) : resolve(JSON.parse(data))),
      )
    ))),
  )
);

const concatMessages: (messages: Array<Array<Message>>) => Array<Message> = (messages) => {
  let concatenated = [];

  messages.forEach((message) => {
    concatenated = concatenated.concat(message);
  });

  return concatenated;
};

const checkForDuplicateIds: (messages: Array<Message>) => Array<Message> = (messages) => {
  const ids = {};
  const duplicates = [];

  messages.forEach((message) => {
    if (ids[message.id]) {
      duplicates.push(message.id);
    }

    ids[message.id] = true;
  });

  if (duplicates.length) {
    log.warn(`Found duplicate message IDs: (${duplicates.join(',')}).`);
  }

  return messages;
};

const generateCSVFile: (messages: Array<Message>) => string = (messages) => stringify(
  messages
    .sort((a, b) => (a.id > b.id ? 1 : 0))
    .map((message) => [
      message.id,
      message.description,
      message.defaultMessage,
    ]),
);

const writeCSVFile: (outFile: string) => (csv: string) => Promise<void> = (outFile) => (csv) => (
  new Promise((resolve, reject) => {
    writeFile(outFile, csv, (error) => (error ? reject(error) : resolve()));
  })
);

export const generateMessagesJSON: (outFile: string) => Promise<void> = (outFile) => (
  getMessageFiles()
    .then(parseMessages)
    .then(concatMessages)
    .then(checkForDuplicateIds)
    .then(generateCSVFile)
    .then(writeCSVFile(outFile))
);
