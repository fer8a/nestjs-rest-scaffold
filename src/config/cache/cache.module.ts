import { CacheModule as cacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Module used to cache http GET responses
 * https://docs.nestjs.com/techniques/caching
 *
 * @returns {DynamicModule} Nest Application DynamicModule
 */
export const CacheModule = cacheModule.register(
  cacheModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      ttl: configService.get('CACHE_TTL', 5000),
      max: configService.get('CACHE_MAX', 100),
    }),
    inject: [ConfigService],
  }),
);
