// @flow
import { CrowdIn, Log } from '../utils';
import { mkdir, writeFile } from 'fs';
import { parse } from 'csv-string';
import rimraf from 'rimraf';

const log = new Log();

const clean: (path: string) => Promise<void> = (path) => (
  new Promise((resolve, reject) => {
    rimraf(path, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    });
  })
);

const convertToJson: (
  file: Array<Array<string>>,
  columnPairs: [number, number],
) => Promise<Object> = (
  file,
  [
    idColumnIndex,
    valueColumnIndex,
  ],
) => (
  parse(file).reduce(
    (accumulator, item) => ({
      ...accumulator,
      [item[idColumnIndex]]: item[valueColumnIndex],
    }),
    {},
  )
);

const makeOutputPath: (
  outputDirectory: string,
  ...rest: Array<void>
) => Promise<void> = (outputDirectory) => (
  new Promise((resolve, reject) => {
    mkdir(outputDirectory, 0o777, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  })
);

const writeTranslationFile: (
  filename: string,
  contents: Object,
  ...rest: Array<void>
) => Promise<void> = (filename, contents) => (
  new Promise((resolve, reject) => (
    writeFile(
      filename,
      JSON.stringify(contents, null, 2),
      { flag: 'wx' },
      (error) => {
        if (error) {
          reject(error);
        }

        resolve();
      },
    )
  ))
);

export default async function (
  projectId: string,
  projectKey: string,
  filename: string,
  outputDirectory: string,
  columnPairs: [number, number],
) {
  const crowdIn = new CrowdIn(projectId, projectKey);

  await clean(outputDirectory);
  await makeOutputPath(outputDirectory);
  log.info('Getting list of supported languages.');
  const projectInfo = await crowdIn.getProjectInformation();
  const languages = projectInfo.languages.filter((language) => language.can_translate);
  await Promise.all(languages.map((language) => {
    const outputFile = `${outputDirectory}/${language.code}.json`;

    return crowdIn
      .exportFile(filename, language.code)
      .then((file) => convertToJson(file, columnPairs))
      .then((json) => writeTranslationFile(outputFile, json))
      .then(() => log.info(`Saved ${outputFile}.`))
    ;
  }));
  log.success('Done');
}
