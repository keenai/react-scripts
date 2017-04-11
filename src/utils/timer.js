// @flow
import uuid from 'node-uuid';

export default class Timer {
  id: string;
  startTime: void | number;

  static getTimestamp(): string {
    const time = new Date();
    const hours = `0${time.getHours()}`.slice(-2);
    const minutes = `0${time.getMinutes()}`.slice(-2);
    const seconds = `0${time.getSeconds()}`.slice(-2);

    return `[${hours}:${minutes}:${seconds}]`;
  }

  constructor() {
    this.id = uuid.v4();
    this.startTime = undefined;
  }

  getTimeElapsed(): string {
    if (this.startTime === undefined) {
      this.start();
    }

    const difference = new Date(Date.now() - (this.startTime || 0));
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

  reset() {
    this.startTime = undefined;
  }

  start(): void {
    this.startTime = Date.now();
  }
}
