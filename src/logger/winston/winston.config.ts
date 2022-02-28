import { utilities } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

/**
 * Return default configuration for Winston Logger
 *
 * @returns {winston.LoggerOptions} Logger options
 */
export const winstonConfig: winston.LoggerOptions = {
  defaultMeta: {
    env: config.get<string>('NODE_ENV'),
    version: config.get<string>('VERSION'),
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(utilities.format.nestLike()),
    }),
  ],
};
