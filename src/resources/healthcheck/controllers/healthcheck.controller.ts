import { PrismaService } from '@/config/db/prisma/services/prisma.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Healthcheck')
@Controller('health')
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    // Check Services connection
    return this.health.check([
      // The process should not use more than 150MB memory
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check DB connection
      () => this.prisma.pingCheck('prisma', this.prismaService),
    ]);
  }
}
