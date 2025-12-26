import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Serie } from './entities/serie.entity';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { EstadosModule } from '../estados/estados.module';

@Module({
  imports: [TypeOrmModule.forFeature([Serie]), EstadosModule],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}