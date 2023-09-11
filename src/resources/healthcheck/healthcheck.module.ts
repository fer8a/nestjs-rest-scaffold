import { PrismaModule } from '@/config/db/prisma/prisma.module';
import { Logger, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthcheckController } from './controllers/healthcheck.controller';

@Module({
  imports: [TerminusModule.forRoot({ logger: Logger }), PrismaModule],
  controllers: [HealthcheckController],
})
export class HealthcheckModule {}
