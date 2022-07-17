import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: (process.env.KAFKA_BROKER as string).split(','),
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      // sasl: {
      //   mechanism: 'scram-sha-512',
      //   username: process.env.KAFKA_USER') as string,
      //   password: process.env.KAFKA_PASS') as string,
      // },
    },
    // subscribe: {
    //   fromBeginning: true,
    // },
    producer: {
      allowAutoTopicCreation: false,
    },
    consumer: {
      groupId: process.env.KAFKA_GROUP_ID as string,
    },
  },
};
