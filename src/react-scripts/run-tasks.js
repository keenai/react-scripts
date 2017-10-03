// @flow
export default function runTasks(...tasks: Array<Function>) {
  if (tasks.length === 0) {
    process.exit(0);
  }

  const run = (fn: Function) => (
    typeof fn.then === 'function' ? fn(this) : Promise.resolve(fn(this))
  );

  run(tasks[0])
    .then((result) => runTasks.apply(result, tasks.slice(1)))
    .catch((error: Error = new Error('Uncaught Exception')) => {
      console.error(error);
      process.exit(1);
    })
  ;
}