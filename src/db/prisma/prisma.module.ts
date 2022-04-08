import { Module } from '@nestjs/common';
import { PrismaFilterService } from './services/filter.service';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [PrismaService, PrismaFilterService],
  exports: [PrismaService, PrismaFilterService],
})
export class PrismaModule {}
