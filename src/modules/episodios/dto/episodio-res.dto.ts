import { Expose, Type, plainToInstance } from 'class-transformer';
import { Episodio } from '../entities/episodio.entity';
import { EstadoResDto } from '../../estados/dto/estado-res.dto';
import { SerieResDto } from '../../series/dto/serie-res.dto';

export class EpisodioResDto {
  @Expose()
  id: string;

  @Expose()
  titulo: string;

  @Expose()
  duracion: number;

  @Expose()
  numeroCapitulo: number;

  @Expose()
  idSerie: string;

  @Expose()
  @Type(() => SerieResDto)
  serie: SerieResDto;

  @Expose()
  idEstado: string;

  @Expose()
  @Type(() => EstadoResDto)
  estado: EstadoResDto;

  static fromEntity(entity: Episodio): EpisodioResDto;
  static fromEntity(entity: Episodio[]): EpisodioResDto[];
  static fromEntity(
    entity: Episodio | Episodio[],
  ): EpisodioResDto | EpisodioResDto[] {
    return plainToInstance(EpisodioResDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}