import {
  Catch,
  ArgumentsHost,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2025':
          throw new NotFoundException(exception.message);
          break;
        case 'P2002': {
          const fields = Array.isArray(exception.meta?.target)
            ? exception.meta?.target.join(', ')
            : String(exception.meta?.target);
          throw new ConflictException(
            `Unique constraint failed on the fields: [${fields}]`,
          );
          break;
        }
        default:
          break;
      }
    }

    super.catch(exception, host);
  }
}
