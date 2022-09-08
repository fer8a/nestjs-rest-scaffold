import { createMock } from '@golevelup/ts-jest';
import { HealthCheckService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { PrismaHealthIndicator } from '../services/prisma.health';
import { HealthcheckController } from './healthcheck.controller';

describe('Healthcheck Controller', () => {
  let controller: HealthcheckController;
  let healthService: HealthCheckService;
  let prismaHealth: PrismaHealthIndicator;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthcheckController],
    })
      .useMocker(() => createMock())
      .compile();

    controller = moduleRef.get(HealthcheckController);
    healthService = moduleRef.get(HealthCheckService);
    prismaHealth = moduleRef.get(PrismaHealthIndicator);
  });

  describe('Test healthCheck function', () => {
    it('Should return OK-UP health indicators', async () => {
      const upMock = { Database: { status: 'up' as const } };

      jest.spyOn(prismaHealth, 'pingCheck').mockResolvedValueOnce(upMock);

      const okMock = {
        status: 'ok' as const,
        info: await prismaHealth.pingCheck('Database', { provider: '' }),
        error: {},
        details: await prismaHealth.pingCheck('Database', { provider: '' }),
      };

      jest.spyOn(prismaHealth, 'pingCheck').mockResolvedValueOnce(upMock);
      jest.spyOn(healthService, 'check').mockResolvedValueOnce(okMock);

      const response = await controller.healthCheck();

      expect(healthService.check).toHaveBeenCalled();
      expect(prismaHealth.pingCheck).toHaveBeenCalled();
      expect(response).toBe(okMock);
    });

    it('Should return ERROR-DOWN health indicators', async () => {
      const downMock = { Database: { status: 'down' as const } };

      jest.spyOn(prismaHealth, 'pingCheck').mockResolvedValueOnce(downMock);

      const errorMock = {
        status: 'error' as const,
        info: {},
        error: await prismaHealth.pingCheck('Database', { provider: '' }),
        details: await prismaHealth.pingCheck('Database', { provider: '' }),
      };

      jest.spyOn(prismaHealth, 'pingCheck').mockResolvedValueOnce(downMock);
      jest.spyOn(healthService, 'check').mockResolvedValueOnce(errorMock);

      const response = await controller.healthCheck();

      expect(healthService.check).toHaveBeenCalled();
      expect(prismaHealth.pingCheck).toHaveBeenCalled();
      expect(response).toBe(errorMock);
    });
  });
});
