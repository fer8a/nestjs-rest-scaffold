import { otelSdk } from './config/telemetry/otel-tracer';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Environment } from './config/env/constants';
// import { kafkaConfig } from '@/transporters/kafka/kafka.config';
import helmet from '@fastify/helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  // Open Telemetry SDK initialization
  otelSdk.start();

  // App instance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true, bufferLogs: true },
  );

  // Environment variables
  const config = app.get(ConfigService);

  // Bind fastify middlewares
  await app.register(helmet);

  // Bind Logger
  app.useLogger(app.get(Logger));
  app.flushLogs();

  // Bind global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: config.get('NODE_ENV') === Environment.production,
      whitelist: true,
      transform: true,
    }),
  );

  // Init Swagger docs
  if (config.get('NODE_ENV') !== Environment.production) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Boilerplate API')
      .setDescription('Example docs')
      .setVersion(config.get('npm_package_version') as string)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  // Starts listening for shutdown hooks
  if (config.get('NODE_ENV') === Environment.production) {
    app.enableShutdownHooks();
  }

  // Initialize microservices
  // app.connectMicroservice(kafkaConfig);
  // await app.startAllMicroservices();

  await app.listen(config.get('PORT', 3000));
}
bootstrap();
