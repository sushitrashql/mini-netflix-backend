import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { validationSchema } from './config/env.validation';
import { EstadosModule } from './modules/estados/estados.module';
import { SeriesModule } from './modules/series/series.module';
import { CommonModule } from './common/common.module';
import { EpisodiosModule } from './modules/episodios/episodios.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      validationSchema,
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        if (!dbConfig) {
          throw new Error('Database configuration not found');
        }
        return dbConfig;
      },
    }),
    CommonModule,
    // Módulos de negocio
    EstadosModule,

    SeriesModule,

    EpisodiosModule,

    AuthModule,
    UsuariosModule,
    RolesModule,
  ],
})
export class AppModule {}
