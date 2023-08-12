import { WinstonModule as LoggerModule } from 'nest-winston';
import { winstonConfig } from './winston.config';

/**
 * Module used to create a Winton logger instance
 * https://github.com/gremo/nest-winston
 *
 * @returns {DynamicModule} Nest Application DynamicModule
 */
export const WinstonModule = LoggerModule.forRoot(winstonConfig);
