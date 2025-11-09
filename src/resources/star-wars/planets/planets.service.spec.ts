import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsService } from './planets.service';
import { createMock } from '@golevelup/ts-jest';
import { PlanetsService as PlanetsProvider } from '@/providers/swapi/services/planets.service';
import { Planet } from '@/providers/swapi/entities/planet.entity';
import { AxiosResponse } from 'axios';

describe('PlanetsService', () => {
  let service: PlanetsService;
  let planetsProvider: PlanetsProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanetsService],
    })
      .useMocker((token) => createMock(token))
      .compile();

    service = module.get<PlanetsService>(PlanetsService);
    planetsProvider = module.get<PlanetsProvider>(PlanetsProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(planetsProvider).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of planets', async () => {
      const result = createMock<AxiosResponse<Planet[]>>({
        data: [{ name: 'Tatooine' }, { name: 'Alderaan' }],
      });
      jest.spyOn(planetsProvider, 'findAll').mockResolvedValueOnce(result);

      const response = await service.findAll();

      expect(planetsProvider['findAll']).toHaveBeenCalledTimes(1);
      expect(response).toEqual(result.data);
    });
  });

  describe('findOne', () => {
    it('should return a single planet by id', async () => {
      const planet = createMock<AxiosResponse<Planet>>({
        data: { name: 'Tatooine' },
      });
      jest.spyOn(planetsProvider, 'findOne').mockResolvedValueOnce(planet);

      const response = await service.findOne(1);

      expect(planetsProvider['findOne']).toHaveBeenCalledTimes(1);
      expect(response).toEqual(planet.data);
    });
  });
});
