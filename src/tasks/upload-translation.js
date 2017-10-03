// @flow
import { CrowdIn, Log } from '../utils';

const log = new Log();

export default async function (projectId: string, projectKey: string, input: string) {
  const crowdIn = new CrowdIn(projectId, projectKey);

  log.info(`Uploading "${input}".`);
  await crowdIn.updateFile(input);
}
