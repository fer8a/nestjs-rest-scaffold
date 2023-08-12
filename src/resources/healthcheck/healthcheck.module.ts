import { PrismaModule } from '@/config/db/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthcheckController } from './controllers/healthcheck.controller';
import { PrismaHealthIndicator } from './services/prisma.health';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthcheckController],
  providers: [PrismaHealthIndicator],
})
export class HealthcheckModule {}
