import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Prisma ORM DB module
 * https://docs.nestjs.com/recipes/prisma#prisma
 */

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
