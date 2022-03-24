import tracer from './config/tracer/otel-tracer';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCors from 'fastify-cors';
import { fastifyHelmet } from 'fastify-helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { Environment } from './common/constants';

async function bootstrap() {
  // initialize the tracer SDK and register with the OpenTelemetry API
  await tracer.start();

  // Environment variables
  const config = new ConfigService();

  // App instance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  // Bind Logger
  app.useLogger(app.get(Logger));
  app.flushLogs();

  // Bind fastify middlewares
  const helmetOptions = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  };
  await app.register(fastifyHelmet, helmetOptions);
  await app.register(fastifyCors);

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
  // app.connectMicroservice(microConfig);
  // await app.startAllMicroservices();

  await app.listen(config.get('PORT', 3001));
}
bootstrap();
