import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

// Extend FastifyRequest to include 'user'
declare module 'fastify' {
  interface FastifyRequest {
    user?: Record<string, unknown>;
  }
}

/**
 * Decorator to retrieve the current authenticated user from the request
 *
 * @param {unknown} data Data properties for the user
 * @param {ExecutionContext} ctx Execution context
 */
export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
