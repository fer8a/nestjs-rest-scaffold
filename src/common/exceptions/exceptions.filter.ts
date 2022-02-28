import {
  Catch,
  ArgumentsHost,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  /**
   * Function to intercept desired exceptions for custom logic.
   *
   * @param exception Thrown exception
   * @param host ArgumentsHost
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const errName = (exception as Error).name;

    if (errName === 'EntityNotFoundError') {
      throw new NotFoundException(exception);
    }

    if (errName === 'QueryFailedError') {
      throw new BadRequestException(exception);
    }

    super.catch(exception, host);
  }
}
