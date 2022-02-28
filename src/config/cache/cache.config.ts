import { CacheModuleOptions } from '@nestjs/common';

/**
 * Return default configuration for Cache storage
 *
 * @returns {CacheModuleOptions} Cache options
 */
export const cacheConfig: CacheModuleOptions = {
  ttl: 10,
  max: 100,
  //store:
};
