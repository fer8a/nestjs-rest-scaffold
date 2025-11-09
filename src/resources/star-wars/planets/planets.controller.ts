import { Controller, Get, Param } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { Planet } from './entities/planet.entity';

@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  async findAll(): Promise<Planet[]> {
    return this.planetsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Planet> {
    return this.planetsService.findOne(+id);
  }
}
