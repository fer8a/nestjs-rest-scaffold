import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaHealthIndicator } from './prisma.health';
// import { PrismaService } from '@/db/prisma/services/prisma.service';
// import { kafkaConfig } from '@/transporters/kafka/kafka.config';
// import { KafkaOptions } from '@nestjs/microservices';

@ApiTags('Healthcheck')
@Controller('health')
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private prisma: PrismaHealthIndicator, // private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    /*const kafkaOptions = {
      transport: kafkaConfig.transport,
      options: kafkaConfig.options,
      timeout: 10000,
    };
    const prismaSettings = {
      connection: this.prismaService,
      provider: 'postgresql',
      timeout: 5000,
    };*/

    return this.health.check([
      // The process should not use more than 150MB memory
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check Kafka connection
      // () => this.microservice.pingCheck<KafkaOptions>('Kafka', kafkaOptions),
      // Check Prisma DB connection
      // () => this.prisma.pingCheck('Prisma', prismaSettings),
    ]);
  }
}
