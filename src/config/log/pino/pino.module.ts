import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from './pino.config';

/**
 * Module used to create a Pino logger instance
 * https://github.com/iamolegga/nestjs-pino
 *
 * @returns {DynamicModule} Nest Application DynamicModule
 */
export const PinoModule = LoggerModule.forRoot(pinoConfig);
