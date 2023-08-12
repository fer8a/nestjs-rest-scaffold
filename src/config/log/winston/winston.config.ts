import { utilities } from 'nest-winston';
import * as winston from 'winston';

/**
 * Return default configuration for Winston Logger
 *
 * @returns {winston.LoggerOptions} Logger options
 */
export const winstonConfig: winston.LoggerOptions = {
  defaultMeta: {
    env: process.env.NODE_ENV,
    version: process.env.VERSION,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(utilities.format.nestLike()),
    }),
  ],
};
