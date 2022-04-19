import { Injectable, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
  ConnectionNotFoundError,
  TimeoutError,
  MongoConnectionError,
} from '@nestjs/terminus';
import { checkPackages, promiseTimeout } from '@nestjs/terminus/dist/utils';
import { PrismaClient } from '@prisma/client';

export interface PrismaPingCheckSettings {
  /**
   * The connection which the ping check should get executed
   */
  connection?: PrismaClient;

  /**
   * The database driver (MySQL, PostgreSQL, etc)
   */
  provider: string;

  /**
   * The amount of time the check should require in ms
   */
  timeout?: number;
}

/**
 * The PrismaHealthIndicator contains health indicators
 * which are used for health checks related to Prisma
 *
 * @publicApi
 * @module TerminusModule
 */
@Injectable({ scope: Scope.TRANSIENT })
export class PrismaHealthIndicator extends HealthIndicator {
  /**
   * Initializes the PrismaHealthIndicator
   *
   * @param {ModuleRef} moduleRef The NestJS module reference
   */
  constructor(private moduleRef: ModuleRef) {
    super();
    this.checkDependantPackages();
  }

  /**
   * Checks if the dependant packages are present
   */
  private checkDependantPackages() {
    checkPackages(['@prisma/client', 'prisma'], this.constructor.name);
  }

  /**
   * Pings a Prisma connection
   *
   * @param connection The connection which the ping should get executed
   * @param provider The driver used by the connection
   * @param timeout The timeout how long the ping should maximum take
   *
   */
  private async pingDb(
    connection: PrismaClient,
    provider: string,
    timeout: number,
  ) {
    let check: Promise<unknown> = Promise.resolve();

    switch (provider) {
      case 'mongodb':
        // check = this.checkMongoDBConnection(connection);
        break;
      case 'oracle':
        check = connection.$queryRaw`SELECT 1 FROM DUAL`;
        break;
      case 'sap':
        check = connection.$queryRaw`SELECT now() FROM dummy`;
        break;
      default:
        check = connection.$queryRaw`SELECT 1`;
        break;
    }

    return await promiseTimeout(timeout, check);
  }

  /**
   * Checks if responds in (default) 1000ms and
   * returns a result object corresponding to the result
   * @param key The key which will be used for the result object
   * @param options The options for the ping
   *
   * @example
   * PrismaHealthIndicator.pingCheck('database', { timeout: 1500 });
   */
  async pingCheck(
    key: string,
    options: PrismaPingCheckSettings,
  ): Promise<HealthIndicatorResult> {
    let isHealthy = false;
    this.checkDependantPackages();

    const connection = options.connection; //|| this.getContextConnection();
    const timeout = options.timeout || 1000;

    if (!connection) {
      throw new ConnectionNotFoundError(
        this.getStatus(key, isHealthy, {
          message: 'Connection provider not found in application context',
        }),
      );
    }

    try {
      await this.pingDb(connection, options.provider, timeout);
      isHealthy = true;
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new TimeoutError(
          timeout,
          this.getStatus(key, isHealthy, {
            message: `timeout of ${timeout}ms exceeded`,
          }),
        );
      }
      if (err instanceof MongoConnectionError) {
        throw new HealthCheckError(
          err.message,
          this.getStatus(key, isHealthy, {
            message: err.message,
          }),
        );
      }
    }

    if (isHealthy) {
      return this.getStatus(key, isHealthy);
    } else {
      throw new HealthCheckError(
        `${key} is not available`,
        this.getStatus(key, isHealthy),
      );
    }
  }
}
