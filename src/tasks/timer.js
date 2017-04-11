// @flow
let START_TIME;

export function getTimeElapsed() {
  const difference = new Date(Date.now() - START_TIME);
  const milliseconds = difference.getMilliseconds();
  const minutes = difference.getMinutes();
  const seconds = difference.getSeconds();

  let timeElapsed = `${milliseconds}ms`;

  if (seconds > 0) {
    timeElapsed = `${seconds}.${String(milliseconds).slice(0, 2)}s`;
  }

  if (minutes > 0) {
    timeElapsed = `${minutes}m ${seconds}.${String(milliseconds).slice(0, 2)}s`;
  }

  return timeElapsed;
}

export function getTimestamp() {
  const time = new Date();
  const hours = `0${time.getHours()}`.slice(-2);
  const minutes = `0${time.getMinutes()}`.slice(-2);
  const seconds = `0${time.getSeconds()}`.slice(-2);

  return `[${hours}:${minutes}:${seconds}]`;
}

export function startTimer(): void {
  START_TIME = Date.now();
}
