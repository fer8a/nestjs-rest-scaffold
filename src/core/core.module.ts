import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ConfigModule } from '@/config/env/config.module';
import { CacheModule } from '@/config/cache/cache.module';
import { LoggerModule } from '@/logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from '@/core/exceptions/exceptions.filter';
import { LogInterceptor } from '@/core/interceptors/log.interceptor';
import { HealthcheckModule } from '@/resources/healthcheck/healthcheck.module';

@Module({
  imports: [CacheModule, ConfigModule, LoggerModule, HealthcheckModule],
  providers: [
    Logger,
    { provide: APP_INTERCEPTOR, useClass: LogInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
  ],
})
export class CoreModule {}
