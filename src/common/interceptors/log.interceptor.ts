import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {
    this.logger = new Logger(LogInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    this.logger.log(this.buildRequestLog(context));
    const observable = next.handle();
    return observable.pipe(
      tap(() => this.logger.log(this.buildResponseLog(context, now))),
    );
  }

  /**
   * Method to format a Request log
   *
   * @param context an `ExecutionContext` object providing methods to access the
   * route handler and class about to be invoked.
   */
  buildRequestLog(context: ExecutionContext) {
    const { params, query, body } = context.switchToHttp().getRequest();

    return {
      msg: 'Incoming Request',
      class: context.getClass().name,
      handler: context.getHandler().name,
      request: { params, query, body },
    };
  }

  /**
   * Method to format a Response log
   *
   * @param context an `ExecutionContext` object providing methods to access the
   * route handler and class about to be invoked.
   */
  buildResponseLog(context: ExecutionContext, before: number) {
    const { statusCode, outputSize } = context.switchToHttp().getResponse();

    return {
      msg: 'Outgoing Response',
      class: context.getClass().name,
      handler: context.getHandler().name,
      executionTime: `${Date.now() - before}ms`,
      response: { statusCode, outputSize },
    };
  }
}
