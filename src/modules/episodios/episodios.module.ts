import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episodio } from './entities/episodio.entity';
import { EpisodiosService } from './episodios.service';
import { EpisodiosController } from './episodios.controller';
import { EstadosModule } from '../estados/estados.module';
import { SeriesModule } from '../series/series.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Episodio]),
    EstadosModule,
    SeriesModule,
  ],
  controllers: [EpisodiosController],
  providers: [EpisodiosService],
  exports: [EpisodiosService],
})
export class EpisodiosModule {}