// @flow
import { Log } from '../utils';
import detect from 'detect-port';

const log = new Log();

export function checkRequiredPorts(requiredPorts: Array<number>): Promise<*> {
  return Promise
    .all(requiredPorts.map(detect))
    .then((detectedPorts) => {
      const unavailablePorts = requiredPorts.filter(
        (required) => !detectedPorts.find(
          (detected) => (detected === required),
        ),
      );

      if (unavailablePorts.length) {
        return Promise.reject(
          new Error([
            'Something is already running on the following required port(s):',
            unavailablePorts.join(', '),
          ].join(' ')),
        );
      }

      log.info('Required ports are available.');

      return Promise.resolve();
    })
  ;
}
