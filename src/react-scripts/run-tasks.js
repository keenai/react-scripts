// @flow
import { Log } from '../utils';

const log = new Log();

export default function runTasks(...tasks: Array<Function>) {
  if (tasks.length === 0) {
    return;
  }

  const run = (fn: Function) => (
    typeof fn.then === 'function' ? fn(process) : Promise.resolve(fn(process))
  );

  run(tasks[0])
    .then((result) => runTasks.apply(result, tasks.slice(1)))
    .catch((error: Error = new Error('Uncaught Exception')) => {
      log.error(error.message);
      process.exit(1);
    })
  ;
}
