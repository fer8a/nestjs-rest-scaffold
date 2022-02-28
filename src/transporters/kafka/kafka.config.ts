import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

const config = new ConfigService();

/**
 * Return default configuration for Kafka connection
 *
 * @returns {KafkaOptions} - Kafka options
 */
export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: config.get('KAFKA_CLIENT_ID'),
      brokers: [config.get('KAFKA_BROKER')],
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      // sasl: {
      //   mechanism: 'scram-sha-512',
      //   username: config.get('KAFKA_USER'),
      //   password: config.get('KAFKA_PASS'),
      // },
    },
    // subscribe: {
    //   fromBeginning: true,
    // },
    producer: {
      allowAutoTopicCreation: false,
    },
    consumer: {
      groupId: config.get('KAFKA_GROUP_ID'),
    },
  },
};
