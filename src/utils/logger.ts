let chalk_1;
import('chalk')
  .then((chalk) => {
    chalk_1 = chalk.default || chalk;
    // Your code that uses chalk_1 goes here
  })
  .catch((error) => {
    // Handle the error if the import fails
    console.error(error);
  });

import * as Sentry from '@sentry/node';
import { LeanRequest } from './interfaces';

// region ERROR JSON handling
// this will define a proper toJSON function on the standard Error object prototype
// and thus will allow it to be JSON.stringify-ed properly
if (!('toJSON' in Error.prototype))
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      const alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true
  });
// endregion ERROR JSON handling

export const { log, error } = console;

export function logDanger(content: string): void {
  log(chalk_1?.red?.bold(content) || content);
}

export function logWarning(content: string): void {
  log(chalk_1?.yellow?.bold(content) || content);
}

export function logSuccess(content: string): void {
  log(chalk_1?.green?.bold(content) || content);
}

export function logPrimary(content: string): void {
  log(chalk_1?.blue?.bold(content) || content);
}

export function logConsole(content: unknown): void {
  log(content);
}

export function sentryErrLog(
  err: Error,
  title?: string, // TODO: title ignored, maybe send it to sentry as well
  user?: unknown,
  request?: LeanRequest
): void {
  Sentry.captureException(err, { extra: { request }, user });

  if (request) error(new Date().toISOString() + ': ', err, request);
  else error(new Date().toISOString() + ': ', err);
}

export function sentryMessageHandler(context: string, data: unknown): void {
  const additionalInfo = data ? ' : ' + JSON.stringify(data) : '';

  Sentry.captureMessage(context + additionalInfo);
}
