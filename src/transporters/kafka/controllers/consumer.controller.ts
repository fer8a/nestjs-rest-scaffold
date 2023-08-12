import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  /**
   * Retrieve message from a Kafka Topic
   *
   * @returns Kafka response object
   */
  @EventPattern(process.env.KAFKA_TOPIC)
  receivePayload(@Payload() message: unknown, @Ctx() context: KafkaContext) {
    console.log(context.getTopic());
    return JSON.parse(JSON.stringify(message));
  }
}
