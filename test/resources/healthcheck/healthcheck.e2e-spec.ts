import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HealthcheckModule } from '@/resources/healthcheck/healthcheck.module';

let app: NestFastifyApplication;
let upMock: Record<string, unknown>;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [HealthcheckModule],
  }).compile();

  app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
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

describe('(e2e) Healthcheck', () => {
  describe('healthcheck', () => {
    it(`should /GET healthcheck and return a success response`, () => {
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
  });
});

afterAll(async () => {
  await app.close();
});
