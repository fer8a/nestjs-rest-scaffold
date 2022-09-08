import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: (process.env.KAFKA_BROKER as string).split(','),
      ssl: process.env.KAFKA_SSL === 'true',
    },
    producer: {
      allowAutoTopicCreation: false,
    },
    consumer: {
      groupId: process.env.KAFKA_GROUP_ID as string,
    },
  },
};
