import { ConfigService } from '@nestjs/config';
import { Environment } from '@/config/env/constants';
import { Params } from 'nestjs-pino';

const config = new ConfigService();

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

const serializers = {
  req(request: {
    method: string;
    url: string;
    routerPath: string;
    params: unknown;
  }) {
    return {
      method: request.method,
      url: request.url,
      path: request.routerPath,
      parameters: request.params,
    };
  },
  res(reply: { statusCode: number }) {
    return {
      statusCode: reply.statusCode,
    };
  },
};

/**
 * Return default configuration for Pino Logger
 *
 * @returns {Params} - Logger options
 */
export const pinoConfig: Params = {
  pinoHttp: {
    level: config.get('NODE_ENV') === Environment.local ? 'trace' : 'info',
    autoLogging: false,
    transport:
      config.get('NODE_ENV') === Environment.local ? prettyTransp : undefined,
    prettyPrint:
      config.get('NODE_ENV') === Environment.local ? prettyPrint : false,
    formatters,
    serializers,
  },
};
