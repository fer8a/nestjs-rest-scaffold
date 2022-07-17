import './config/tracer/otel-tracer';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { httpAdapter } from './config/httpAdapter';
import { Environment } from './config/env/constants';
import fastifyCors from 'fastify-cors';
import { fastifyHelmet } from 'fastify-helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { PrismaService } from './db/prisma/services/prisma.service';

async function bootstrap() {
  // App instance
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    httpAdapter,
    { bufferLogs: true },
  );

  // Environment variables
  const config = app.get(ConfigService);

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
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  }

  // Initialize microservices
  // app.connectMicroservice(microConfig);
  // await app.startAllMicroservices();

  await app.listen(config.get('PORT', 3001));
}
bootstrap();
