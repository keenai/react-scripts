// @flow
import { error, log } from './log';
import detect from 'detect-port';

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
        error(
          'Something is already running on the following required port(s):',
          unavailablePorts.join(', '),
        );

        return Promise.reject();
      }

      log('Required ports detected.');

      return Promise.resolve();
    })
  ;
}
