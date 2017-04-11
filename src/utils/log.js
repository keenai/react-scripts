// @flow
import chalk from 'chalk';
import Timer from './timer';

export default class Log {
  timer: Timer;

  constructor() {
    this.timer = new Timer();
  }

  error(...rest: Array<mixed>) {
    this.log(chalk.bgRed.bold, ...rest);
  }

  info(...rest: Array<mixed>) {
    this.log(chalk.white, ...rest);
  }

  log(color: Function, ...rest: Array<mixed>) {
    console.log(
      chalk.cyan(Timer.getTimestamp()),
      color(...rest),
      chalk.bold(this.timer.getTimeElapsed()),
    );
  }

  reset(): void {
    this.timer.reset();
  }

  success(...rest: Array<mixed>) {
    this.log(chalk.green, ...rest);
  }

  warn(...rest: Array<mixed>) {
    this.log(chalk.yellow, ...rest);
  }
}
