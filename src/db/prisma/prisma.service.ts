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

  async softDeleteMiddleware() {
    // change delete action to update and add a deleted date
    this.$use(async (params, next) => {
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

  async filterSoftDeleteMiddleware() {
    // remove soft deleted records from find* responses
    this.$use(async (params, next) => {
      const actions = ['findUnique', 'findFirst', 'findMany'];

      if (actions.includes(params.action)) {
        params.args = {
          ...params.args,
          where: { ...params.args?.where, deletedAt: null },
        };
      }

      return await next(params);
    });
  }

  exclude(model: string, fields) {
    const modelFields = {
      ...PrismaClient[`${model}ScalarFieldEnum`],
    };

    fields.forEach((field) => delete modelFields[field]);

    Object.keys(modelFields).forEach((key) => (modelFields[key] = true));

    return modelFields;
  }
}
