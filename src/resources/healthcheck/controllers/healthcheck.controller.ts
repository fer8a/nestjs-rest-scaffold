import { PrismaService } from '@/db/prisma/services/prisma.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from '../services/prisma.health';

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
    const prismaSettings = {
      connection: this.prismaService,
      provider: 'postgresql',
      timeout: 5000,
    };

    // Check Services connection
    return this.health.check([
      // The process should not use more than 150MB memory
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check DB connection
      () => this.prisma.pingCheck('Database', prismaSettings),
    ]);
  }
}
