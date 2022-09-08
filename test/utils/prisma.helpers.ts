import { PrismaService } from '@/db/prisma/services/prisma.service';
import { execSync } from 'child_process';
import * as uuid from 'uuid';

/**
 * Generate a unique UUID value
 *
 * @returns {string} UUID
 */
const buildSchemaId = () => {
  return `test_${uuid.v4()}`;
};

/**
 * Generate test DB URL
 * https://www.prisma.io/docs/reference/database-reference/connection-urls#env
 *
 * @param {string} schema Test schema name
 * @returns {string} Database URL
 */
const buildDatabaseURL = (schema: string) => {
  const url = new URL(process.env.DATABASE_URL as string);
  url.searchParams.append('schema', schema);

  return url.toString();
};

const schemaId = buildSchemaId();
const dbUrl = buildDatabaseURL(schemaId);

/**
 * Initialize Test Prisma Service
 *
 */
const testDbService = new PrismaService({
  datasources: { db: { url: dbUrl } },
});

/**
 * Initialize Test Database
 * https://www.prisma.io/docs/reference/api-reference/command-reference#db-push
 *
 * @returns {void}
 */
const initTestDb = () => {
  execSync(`npx prisma db push`, {
    env: {
      ...process.env,
      DATABASE_URL: dbUrl,
    },
  });
};

/**
 * Clear Test Database
 *
 * @returns {void}
 */
const clearTestDb = async () => {
  await testDbService.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`,
  );
  await testDbService.$disconnect();
};

export { testDbService, initTestDb, clearTestDb };
