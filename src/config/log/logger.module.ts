import { Module } from '@nestjs/common';
import { PinoModule } from './pino/pino.module';

@Module({
  imports: [PinoModule],
})
export class LoggerModule {}
