import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { ERROR_CODES } from '../constants/error-codes.constant';
import { MESSAGES } from '../constants/messages.constant';
import { nanoid } from 'nanoid';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const traceId = nanoid();
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ERROR_CODES.GEN_INTERNAL_ERROR;
    let message = MESSAGES.GENERAL.INTERNAL_ERROR;
    let details: any = null;

    // Manejo de HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).details || null;
      } else {
        message = exceptionResponse;
      }

      // Mapear códigos de error según el status
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          errorCode = ERROR_CODES.GEN_BAD_REQUEST;
          break;
        case HttpStatus.UNAUTHORIZED:
          errorCode = ERROR_CODES.GEN_UNAUTHORIZED;
          break;
        case HttpStatus.FORBIDDEN:
          errorCode = ERROR_CODES.GEN_FORBIDDEN;
          break;
        case HttpStatus.NOT_FOUND:
          errorCode = ERROR_CODES.GEN_NOT_FOUND;
          break;
        case HttpStatus.CONFLICT:
          errorCode = ERROR_CODES.GEN_CONFLICT;
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          errorCode = ERROR_CODES.GEN_VALIDATION_ERROR;
          break;
      }
    }
    // Manejo de errores de TypeORM
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      const error = exception.driverError;

      // Errores de PostgreSQL
      if (error.code === '23505') {
        // Duplicate key
        errorCode = ERROR_CODES.DB_DUPLICATE_ENTRY;
        message = 'Ya existe un registro con esos datos';
        details = error.detail;
      } else if (error.code === '23503') {
        // Foreign key violation
        errorCode = ERROR_CODES.DB_FOREIGN_KEY_VIOLATION;
        message = 'Violación de integridad referencial';
        details = error.detail;
      } else {
        errorCode = ERROR_CODES.DB_QUERY_ERROR;
        message = 'Error en la consulta a la base de datos';
        details = error.message;
      }
    }
    // Errores no controlados
    else {
      this.logger.error(
        `Unhandled exception: ${exception}`,
        exception instanceof Error ? exception.stack : '',
      );
      details = exception instanceof Error ? exception.message : exception;
    }

    // Construir respuesta de error
    const errorResponse: ServiceResponse<null> = {
      success: false,
      message,
      error: {
        code: errorCode,
        details,
      },
      statusCode: status,
      timestamp,
      traceId,
      path,
      method,
      input: {
        query: request.query,
        params: request.params,
        body: this.sanitizeBody(request.body),
      },
    };

    // Log del error
    this.logger.error(
      `[${traceId}] ${method} ${path} - Status: ${status} - Error: ${errorCode} - ${message}`,
      details,
    );

    response.status(status).json(errorResponse);
  }

  /**
   * Sanitizar el body para no exponer información sensible en logs
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}