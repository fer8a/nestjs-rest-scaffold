import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PlanetsModule } from '@/resources/star-wars/planets/planets.module';
import { Planet } from '@/resources/star-wars/planets/entities/planet.entity';
import * as nock from 'nock';

let app: NestFastifyApplication;

// Narrow fixture type to a subset to avoid having to define every Planet field.
type MinimalPlanet = Pick<Planet, 'name' | 'diameter' | 'terrain'>;

const planetsFixture: MinimalPlanet[] = [
  { name: 'Tatooine', diameter: '10465', terrain: 'desert' },
  { name: 'Alderaan', diameter: '12500', terrain: 'grasslands, mountains' },
];
const tatooineFixture = planetsFixture[0];

const SWAPI_BASE = (process.env.SWAPI_URL || 'https://swapi.info/api').replace(
  /\/$/,
  '',
);
// Helper to register mocks for each test (nock interceptors are consumed once by default).
function registerMocks() {
  const scopeHost = SWAPI_BASE.replace(/\/api$/, ''); // Our baseURL includes /api
  // List
  nock(scopeHost).get('/api/planets').reply(200, planetsFixture);
  // Single success
  nock(scopeHost).get('/api/planets/1').reply(200, tatooineFixture);
}

beforeAll(async () => {
  nock.disableNetConnect();
  // Allow localhost (Fastify in-memory still uses network stack sometimes)
  nock.enableNetConnect('127.0.0.1');
  registerMocks();

  const moduleRef = await Test.createTestingModule({
    imports: [PlanetsModule],
  }).compile();

  app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

beforeEach(() => {
  nock.cleanAll();
  registerMocks();
});

describe('(e2e) Star Wars / Planets', () => {
  it('GET /planets returns 200 and a list of planets', async () => {
    const result = await app.inject({ method: 'GET', url: '/planets' });
    const payload = JSON.parse(result.payload) as MinimalPlanet[];

    expect(result.statusCode).toBe(200);
    expect(result.headers['content-type']).toMatch(/application\/json/);
    expect(Array.isArray(payload)).toBe(true);
    expect(payload).toHaveLength(2);
    expect(payload).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Tatooine' }),
        expect.objectContaining({ name: 'Alderaan' }),
      ]),
    );
  });

  it('GET /planets/1 returns 200 and the Tatooine planet', async () => {
    const result = await app.inject({ method: 'GET', url: '/planets/1' });
    const payload = JSON.parse(result.payload) as MinimalPlanet;

    expect(result.statusCode).toBe(200);
    expect(payload).toMatchObject({ name: 'Tatooine', diameter: '10465' });
  });
});

afterAll(async () => {
  await app.close();
  nock.cleanAll();
  nock.enableNetConnect();
});
