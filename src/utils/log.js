// @flow
import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';
import Timer from './timer';

export default class Log {
  logger: Object;
  timer: Timer;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf((info) => {
          const time = chalk.keyword('dodgerblue')(
            `[${new Date(info.timestamp).toLocaleTimeString()}]`,
          );

          const timeElapsed = chalk.keyword('seagreen').bold(
            `+${this.timer.getTimeElapsed()}`,
          );

          return `${time} ${info.message} ${timeElapsed}`;
        }),
      ),
      transports: [
        new transports.Console(),
      ],
    });
    this.timer = new Timer();
  }

  error(...rest: Array<mixed>) {
    this.log('error', chalk.bgRed.bold(...rest));
  }

  info(...rest: Array<mixed>) {
    this.log('info', ...rest);
  }

  log(level: string, ...rest: Array<mixed>) {
    this.logger.log(level, ...rest);
  }

  reset(): void {
    this.timer.reset();
  }

  success(...rest: Array<mixed>) {
    this.log('info', chalk.green(...rest));
  }

  warn(...rest: Array<mixed>) {
    this.log('warn', chalk.yellow(...rest));
  }
}
