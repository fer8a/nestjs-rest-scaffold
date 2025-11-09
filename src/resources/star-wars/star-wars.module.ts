import { Module } from '@nestjs/common';
import { PlanetsModule } from './planets/planets.module';

@Module({
  imports: [PlanetsModule],
})
export class StarWarsModule {}
