import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsController } from './planets.controller';
import { PlanetsService } from './planets.service';
import { createMock } from '@golevelup/ts-jest';
import { Planet } from './entities/planet.entity';

describe('PlanetsController', () => {
  let controller: PlanetsController;
  let planetsService: PlanetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetsController],
      providers: [PlanetsService],
    })
      .useMocker((token) => createMock(token))
      .compile();

    controller = module.get<PlanetsController>(PlanetsController);
    planetsService = module.get<PlanetsService>(PlanetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(planetsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of planets', async () => {
      const result = createMock<Planet[]>([
        { name: 'Tatooine' },
        { name: 'Alderaan' },
      ]);
      jest.spyOn(planetsService, 'findAll').mockResolvedValueOnce(result);

      const response = await controller.findAll();

      expect(planetsService['findAll']).toHaveBeenCalledTimes(1);
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single planet by id', async () => {
      const planet = createMock<Planet>({ name: 'Tatooine' });
      jest.spyOn(planetsService, 'findOne').mockResolvedValueOnce(planet);

      const response = await controller.findOne('test');

      expect(planetsService['findOne']).toHaveBeenCalledTimes(1);
      expect(response).toEqual(planet);
    });
  });
});
