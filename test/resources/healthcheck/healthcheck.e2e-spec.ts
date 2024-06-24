import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { TerminusModule } from '@nestjs/terminus';
import { httpOptions } from '@/config/httpAdapter';
import { HealthcheckController } from '@/resources/healthcheck/controllers/healthcheck.controller';
import { PrismaModule } from '@/config/db/prisma/prisma.module';
import { Logger } from '@nestjs/common';

let app: NestFastifyApplication;
let upMock: Record<string, unknown>;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [TerminusModule.forRoot({ logger: Logger }), PrismaModule],
    controllers: [HealthcheckController],
  }).compile();

  app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(httpOptions),
  );

  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

beforeEach(() => {
  upMock = {
    status: 'ok',
    info: {
      memory_heap: {
        status: 'up',
      },
      prisma: {
        status: 'up',
      },
    },
    error: {},
    details: {
      memory_heap: {
        status: 'up',
      },
      prisma: {
        status: 'up',
      },
    },
  };
});

it(`/GET healthcheck`, () => {
  return app
    .inject({
      method: 'GET',
      url: '/health',
    })
    .then((result) => {
      expect(result.statusCode).toEqual(200);
      expect(result.payload).toEqual(JSON.stringify(upMock));
    });
});

afterAll(async () => {
  await app.close();
});
