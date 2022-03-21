import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.softDeleteMiddleware();
    await this.filterSoftDeleteMiddleware();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Middleware to change all DELETE actions for Soft deletes instead
   *
   * @returns Promise<void>
   */
  async softDeleteMiddleware() {
    this.$use(async (params: any, next: any) => {
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
    this.$use(async (params: any, next: any) => {
      const actions = ['findFirst', 'findMany'];

      if (actions.includes(params.action)) {
        params.args = {
          ...params.args,
          where: { ...params.args?.where, deletedAt: null },
        };
      }

      return await next(params);
    });
  }
}
