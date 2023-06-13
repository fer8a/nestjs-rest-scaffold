import { CacheModule as cacheModule } from '@nestjs/cache-manager';
import { cacheConfig } from './cache.config';

/**
 * Module used to cache http GET responses
 * https://docs.nestjs.com/techniques/caching
 *
 * @returns {DynamicModule} Nest Application DynamicModule
 */
export const CacheModule = cacheModule.register(cacheConfig);
