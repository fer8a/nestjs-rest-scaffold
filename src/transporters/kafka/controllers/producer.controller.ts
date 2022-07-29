import { Controller, Inject, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class ProducerController {
  constructor(
    @Inject('Kafka') private readonly kafka: ClientKafka,
    private config: ConfigService,
  ) {}

  /**
   * Send test message to a Kafka Topic
   *
   * @returns Kafka response
   */
  @Post('test')
  sendPayload() {
    const topic = this.config.get('KAFKA_TOPIC');
    const data = { foo: 'bar', date: new Date() };

    return this.kafka.emit(topic, data);
  }
}
