import { Environment } from '@/config/env/constants';
import { Params } from 'nestjs-pino';

const prettyPrint = {
  sync: true,
  levelFirst: true,
  translateTime: 'mmm dd, HH:MM:ss',
  customColors: Object.entries({
    trace: 'magentaBright',
    debug: 'whiteBright',
    info: 'greenBright',
    warn: 'yellowBright',
    error: 'redBright',
    fatal: 'red',
  })
    .map((e) => `${e[0]}:${e[1]}`)
    .join(','),
};
const prettyTransp = {
  target: 'pino-pretty',
  options: prettyPrint,
};

const formatters = {
  level(label: string) {
    return { level: label };
  },
};

/**
 * Return default configuration for Pino Logger
 *
 * @returns {Params} - Logger options
 */
export const pinoConfig: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === Environment.local ? 'trace' : 'info',
    autoLogging: false,
    transport:
      process.env.NODE_ENV === Environment.local ? prettyTransp : undefined,
    prettyPrint:
      process.env.NODE_ENV === Environment.local ? prettyPrint : false,
    formatters,
    serializers: { req: () => undefined },
  },
};
