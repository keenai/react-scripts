// @flow
export const HOST = process.env.HOST || 'localhost';

export const LOG_LEVEL = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  WARN: 'warn',
};

export const PROTOCOL = process.env.HTTPS === 'true' ? 'https:' : 'http:';

export const PORT = Number(process.env.PORT || 3000);

export const PUBLIC_PATH = `${String(process.env.PUBLIC_PATH || '')}/`.replace(/\/+$/, '/');

export const MAX_ENTRYPOINT_SIZE = 0.25 * 1e6;

export const MAX_ASSET_SIZE = 0.25 * 1e6;

export const WEBPACK_PORT = PORT + 1;
