import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Prefijo global de la API
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS - Configuración para producción
  const corsOrigins =
    process.env.NODE_ENV === 'production'
      ? process.env.CORS_ORIGIN?.split(',') || ['*']
      : '*';

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Pipes globales
  app.useGlobalPipes(new ValidationPipe());

  // Filters globales
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptors globales
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Guards globales
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Swagger - Solo en desarrollo y staging
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Mini Netflix API')
      .setDescription('API RESTful para gestión de series y episodios')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Ingrese su token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log(`📚 Documentación Swagger: http://localhost:${process.env.PORT || 3000}/api/docs`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // ✅ Importante para Render

  logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}`);
  logger.log(`🔗 API Prefix: /${apiPrefix}`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();