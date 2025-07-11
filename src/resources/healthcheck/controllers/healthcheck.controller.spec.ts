import { createMock } from '@golevelup/ts-jest';
import { HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { HealthcheckController } from './healthcheck.controller';
import { PrismaService } from '@/config/db/prisma/services/prisma.service';

describe('Healthcheck Controller', () => {
  let controller: HealthcheckController;
  let healthService: HealthCheckService;
  let prismaService: PrismaService;
  let prismaHealth: PrismaHealthIndicator;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthcheckController],
    })
      .useMocker((): unknown => createMock())
      .compile();

    controller = moduleRef.get(HealthcheckController);
    healthService = moduleRef.get(HealthCheckService);
    prismaService = moduleRef.get(PrismaService);
    prismaHealth = moduleRef.get(PrismaHealthIndicator);
  });

  describe('Test healthCheck function', () => {
    it('Should return OK-UP health indicators', async () => {
      const upMock = { prisma: { status: 'up' as const } };
      const okMock = {
        status: 'ok' as const,
        info: await prismaHealth.pingCheck('prisma', prismaService),
        error: {},
        details: await prismaHealth.pingCheck('prisma', prismaService),
      };

      const pinCheck = jest
        .spyOn(prismaHealth, 'pingCheck')
        .mockResolvedValueOnce(upMock);
      const check = jest
        .spyOn(healthService, 'check')
        .mockResolvedValueOnce(okMock);

      const response = await controller.healthCheck();

      expect(check).toHaveBeenCalled();
      expect(pinCheck).toHaveBeenCalled();
      expect(response).toBe(okMock);
    });

    it('Should return ERROR-DOWN health indicators', async () => {
      const downMock = { prisma: { status: 'down' as const } };
      const errorMock = {
        status: 'error' as const,
        info: {},
        error: await prismaHealth.pingCheck('prisma', prismaService),
        details: await prismaHealth.pingCheck('prisma', prismaService),
      };

      const pingCheck = jest
        .spyOn(prismaHealth, 'pingCheck')
        .mockResolvedValueOnce(downMock);
      const check = jest
        .spyOn(healthService, 'check')
        .mockResolvedValueOnce(errorMock);

      const response = await controller.healthCheck();

      expect(check).toHaveBeenCalled();
      expect(pingCheck).toHaveBeenCalled();
      expect(response).toBe(errorMock);
    });
  });
});
