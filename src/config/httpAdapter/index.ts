import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as qs from 'qs';

export const httpAdapter = new FastifyAdapter({
  querystringParser: (str) => qs.parse(str),
});
