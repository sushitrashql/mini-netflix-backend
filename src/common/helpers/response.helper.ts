import { ServiceResponse } from '../interfaces/service-response.interface';
import { HttpStatus } from '../constants/http-status.constant';
import { nanoid } from 'nanoid';

export class ResponseHelper {
  static success<T>(
    data: T,
    message: string,
    statusCode: HttpStatus = 200,
    metadata?: ServiceResponse<T>['metadata'],
  ): ServiceResponse<T> {
    return {
      success: true,
      message,
      data,
      statusCode,
      timestamp: new Date().toISOString(),
      traceId: nanoid(),
      metadata,
    };
  }

  static error(
    message: string,
    errorCode: string,
    statusCode: HttpStatus = 500,
    details?: unknown,
    path?: string,
    method?: string,
  ): ServiceResponse<null> {
    return {
      success: false,
      message,
      error: {
        code: errorCode,
        details,
      },
      statusCode,
      timestamp: new Date().toISOString(),
      traceId: nanoid(),
      path,
      method,
    };
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string,
  ): ServiceResponse<T[]> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      success: true,
      message,
      data,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      traceId: nanoid(),
      metadata: {
        page,
        limit,
        total,
        totalPages,
        next: hasNext ? `?page=${page + 1}&limit=${limit}` : null,
        previous: hasPrevious ? `?page=${page - 1}&limit=${limit}` : null,
      },
    };
  }
}