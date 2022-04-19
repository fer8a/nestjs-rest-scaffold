import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

const config = new ConfigService();

@Controller()
export class ConsumerController {
  /**
   * Retrieve message from a Kafka Topic
   *
   * @returns Kafka response object
   */
  @EventPattern(config.get('KAFKA_TOPIC'))
  receivePayload(
    @Payload() message: { value: unknown },
    @Ctx() context: KafkaContext,
  ) {
    console.log(context);
    return JSON.parse(JSON.stringify(message.value));
  }
}
