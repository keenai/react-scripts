// @flow
import { getTimeElapsed, getTimestamp } from './timer';
import { LOG_LEVEL } from '../config/constants';
import chalk from 'chalk';

type LogLevel = (
  | 'error'
  | 'info'
  | 'success'
  | 'warn'
);

type LogLevelMap = {
  [LogLevel]: Function,
};

const logLevelToChalkMap: LogLevelMap = {
  [LOG_LEVEL.ERROR]: chalk.bgRed.bold,
  [LOG_LEVEL.INFO]: chalk.white,
  [LOG_LEVEL.SUCCESS]: chalk.green,
  [LOG_LEVEL.WARN]: chalk.yellow,
};

function logAtLevel(level: LogLevel, ...rest: Array<string>): void {
  const chalkForLevel = logLevelToChalkMap[level];

  console.log(
    chalk.cyan(getTimestamp()),
    chalkForLevel(...rest),
    chalk.bold(getTimeElapsed()),
  );
}

export function error(...rest: Array<string>): void {
  logAtLevel(LOG_LEVEL.ERROR, ...rest);
}

export function log(...rest: Array<string>): void {
  logAtLevel(LOG_LEVEL.INFO, ...rest);
}

export function success(...rest: Array<string>): void {
  logAtLevel(LOG_LEVEL.SUCCESS, ...rest);
}

export function warn(...rest: Array<string>): void {
  logAtLevel(LOG_LEVEL.WARN, ...rest);
}
