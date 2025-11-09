import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { StarWarsModule } from './resources/star-wars/star-wars.module';

@Module({
  imports: [CoreModule, StarWarsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
