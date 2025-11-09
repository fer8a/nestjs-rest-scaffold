import {
  Catch,
  ArgumentsHost,
  NotFoundException,
  ConflictException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { AxiosError } from 'axios';

/**
 * Function to intercept desired exceptions for custom logic.
 *
 * @param exception Thrown exception
 * @param host ArgumentsHost
 */
@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.catchDbException(exception);
    } else if (exception instanceof AxiosError) {
      this.catchHttpException(exception);
    }

    super.catch(exception, host);
  }

  private catchDbException(
    exception: Prisma.PrismaClientKnownRequestError,
  ): void {
    this.logger.error(exception, 'DB Exception');

    switch (exception.code) {
      case 'P2021':
        throw new ServiceUnavailableException(exception.meta?.modelName);
      case 'P2025':
        throw new NotFoundException(exception.message);
      case 'P2002': {
        const fields = Array.isArray(exception.meta?.target)
          ? exception.meta?.target.join(', ')
          : String(exception.meta?.target);
        throw new ConflictException(
          `Unique constraint failed on the fields: [${fields}]`,
        );
      }
      default:
        break;
    }
  }

  private catchHttpException(exception: AxiosError): void {
    this.logger.error(exception.toJSON(), 'HTTP Exception');

    switch (exception.response?.status) {
      case 404:
        throw new NotFoundException(exception.message);
      case 409: {
        throw new ConflictException(exception.message);
      }
      default:
        break;
    }
  }
}
