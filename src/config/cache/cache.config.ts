import { CacheModuleOptions } from '@nestjs/cache-manager';

/**
 * Return default configuration for Cache storage
 *
 * @returns {CacheModuleOptions} Cache options
 */
export const cacheConfig: CacheModuleOptions = {
  ttl: 5000,
  max: 100,
  // store:
};
