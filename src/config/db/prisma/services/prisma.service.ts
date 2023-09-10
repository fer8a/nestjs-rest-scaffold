import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.softDeleteMiddleware();
    await this.filterSoftDeleteMiddleware();
  }

  /**
   * Middleware to change all DELETE actions for Soft deletes instead
   *
   * @returns Promise<void>
   */
  async softDeleteMiddleware() {
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date().toJSON() };
      } else if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deletedAt'] = new Date().toJSON();
        } else {
          params.args['data'] = { deletedAt: new Date().toJSON() };
        }
      }

      return await next(params);
    });
  }

  /**
   * Middleware to filter all soft deleted records out of responses
   *
   * @returns Promise<void>
   */
  async filterSoftDeleteMiddleware() {
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      const actions = ['findFirst', 'findMany'];

      if (params.action === 'findUnique') {
        params.action = 'findFirst';
      }

      if (actions.includes(params.action)) {
        // in case deleted records are not explicitly requested
        // return only non soft-deleted records
        if (!params.args.where['deleted']) {
          params.args.where['deletedAt'] = null;
        }

        delete params.args.where['deleted'];
      }

      return await next(params);
    });
  }
}
