import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlanetsService } from './services/planets.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('SWAPI_URL', 'https://swapi.info/api'),
        timeout: configService.get('HTTP_TIMEOUT', 5000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PlanetsService],
  exports: [PlanetsService],
})
export class SwapiModule {}
