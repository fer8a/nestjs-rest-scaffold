import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthcheckController } from './healthcheck.controller';
import { PrismaHealthIndicator } from './prisma.health';

@Module({
  controllers: [HealthcheckController],
  imports: [TerminusModule],
  providers: [PrismaHealthIndicator],
})
export class HealthcheckModule {}
