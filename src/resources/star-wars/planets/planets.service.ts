import { Injectable, Logger } from '@nestjs/common';
import { PlanetsService as PlanetsProvider } from '@/providers/swapi/services/planets.service';
import { Planet } from './entities/planet.entity';

@Injectable()
export class PlanetsService {
  private readonly logger: Logger;

  constructor(private readonly planetsProvider: PlanetsProvider) {
    this.logger = new Logger(PlanetsService.name);
  }

  async findAll(): Promise<Planet[]> {
    const response = await this.planetsProvider.findAll();
    const planetsNames = response.data.map(({ name }) => name);

    this.logger.debug(planetsNames, 'Planet names');

    return response.data;
  }

  async findOne(id: number): Promise<Planet> {
    const response = await this.planetsProvider.findOne(id);

    this.logger.debug({ name: response.data.name }, 'Planet name');

    return response.data;
  }
}
