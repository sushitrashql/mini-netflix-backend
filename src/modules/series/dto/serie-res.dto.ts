import { Expose, Type, plainToInstance } from 'class-transformer';
import { Serie } from '../entities/serie.entity';
import { EstadoResDto } from '../../estados/dto/estado-res.dto';
import { EpisodioResDto } from 'src/modules/episodios/dto/episodio-res.dto';
import { EpisodioSimpleResDto } from 'src/modules/episodios/dto/episodio-simple-res.dto';

export class SerieResDto {
  @Expose()
  id: string;

  @Expose()
  titulo: string;

  @Expose()
  genero: string;

  @Expose()
  sinopsis: string;

  @Expose()
  urlPortada: string;

  @Expose()
  idEstado: string;

  @Expose()
  @Type(() => EstadoResDto)
  estado: EstadoResDto;

   @Expose()
  @Type(() => EpisodioSimpleResDto)
  episodios?: EpisodioSimpleResDto[];
  
  static fromEntity(entity: Serie): SerieResDto;
  static fromEntity(entity: Serie[]): SerieResDto[];
  static fromEntity(entity: Serie | Serie[]): SerieResDto | SerieResDto[] {
    return plainToInstance(SerieResDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}