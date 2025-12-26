import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { nanoid } from 'nanoid';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ServiceResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ServiceResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;
    const method = request.method;

    return next.handle().pipe(
      map((data) => {
        // Si la data ya es un ServiceResponse, solo agregar info de request
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            path,
            method,
            traceId: data.traceId || nanoid(),
            timestamp: data.timestamp || new Date().toISOString(),
          } as ServiceResponse<T>;
        }

        // Si no, envolver en ServiceResponse
        return {
          success: true,
          message: 'Operación exitosa',
          data,
          statusCode: context.switchToHttp().getResponse().statusCode || 200,
          timestamp: new Date().toISOString(),
          traceId: nanoid(),
          path,
          method,
        } as ServiceResponse<T>;
      }),
    );
  }
}