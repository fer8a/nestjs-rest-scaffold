import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Healthcheck')
@Controller()
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    // const kafkaOptions = {
    //   transport: kafkaConfig.transport,
    //   options: kafkaConfig.options,
    //   timeout: 10000,
    // };

    return this.health.check([
      // The process should not use more than 150MB memory
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check Kafka connection
      // () => this.microservice.pingCheck<KafkaOptions>('Kafka', kafkaOptions),
    ]);
  }
}
