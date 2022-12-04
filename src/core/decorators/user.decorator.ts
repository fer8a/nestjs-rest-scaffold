import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to retrieve the current authenticated user from the request
 *
 * @param {unknown} data Data properties for the user
 * @param {ExecutionContext} ctx Execution context
 */
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[`${data}`] : user;
  },
);
