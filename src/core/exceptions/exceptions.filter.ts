import { Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

/**
 * Function to intercept desired exceptions for custom logic.
 *
 * @param exception Thrown exception
 * @param host ArgumentsHost
 */
@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof Prisma.NotFoundError) {
      throw new NotFoundException(exception.message);
    }

    super.catch(exception, host);
  }
}
