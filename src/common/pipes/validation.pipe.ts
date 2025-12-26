import {
  ValidationPipe as NestValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { ERROR_CODES } from '../constants/error-codes.constant';

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        throw new BadRequestException({
          message: 'Error de validación en los datos enviados',
          code: ERROR_CODES.GEN_VALIDATION_ERROR,
          details: messages,
        });
      },
    });
  }
}