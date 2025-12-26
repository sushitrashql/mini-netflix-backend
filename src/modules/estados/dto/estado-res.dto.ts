import { Expose, plainToInstance } from 'class-transformer';
import { Estado } from '../entities/estado.entity';

export class EstadoResDto {
  @Expose()
  id: string;

  @Expose()
  descripcion: string;

  @Expose()
  valor: string;

  @Expose()
  identificador: string;

  static fromEntity(entity: Estado): EstadoResDto;
  static fromEntity(entity: Estado[]): EstadoResDto[];
  static fromEntity(
    entity: Estado | Estado[],
  ): EstadoResDto | EstadoResDto[] {
    return plainToInstance(EstadoResDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}