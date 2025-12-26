import { Expose, Type, plainToInstance } from 'class-transformer';
import { Episodio } from '../entities/episodio.entity';
import { EstadoResDto } from '../../estados/dto/estado-res.dto';

export class EpisodioSimpleResDto {
  @Expose()
  id: string;

  @Expose()
  titulo: string;

  @Expose()
  duracion: number;

  @Expose()
  numeroCapitulo: number;

  @Expose()
  idEstado: string;

  @Expose()
  @Type(() => EstadoResDto)
  estado: EstadoResDto;

  static fromEntity(entity: Episodio): EpisodioSimpleResDto;
  static fromEntity(entity: Episodio[]): EpisodioSimpleResDto[];
  static fromEntity(
    entity: Episodio | Episodio[],
  ): EpisodioSimpleResDto | EpisodioSimpleResDto[] {
    return plainToInstance(EpisodioSimpleResDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}