import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './kafka.config';

/**
 * Module used to have a Kafka event-streaming layer for microservices
 * https://docs.nestjs.com/microservices/kafka
 *
 * @returns {DynamicModule} Nest Application DynamicModule
 */
export const KafkaModule = ClientsModule.register([
  { name: 'Kafka', ...kafkaConfig },
]);
