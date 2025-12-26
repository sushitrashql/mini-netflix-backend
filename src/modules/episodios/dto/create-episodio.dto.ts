import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateEpisodioDto {
  @ApiProperty({
    description: 'Título del episodio',
    example: 'Capítulo 1: El inicio',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiProperty({
    description: 'Duración del episodio en minutos',
    example: 45,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  duracion: number;

  @ApiProperty({
    description: 'Número del capítulo',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  numeroCapitulo: number;

  @ApiProperty({
    description: 'ID de la serie a la que pertenece',
    example: 'uuid-de-la-serie',
  })
  @IsUUID()
  @IsNotEmpty()
  idSerie: string;

  @ApiProperty({
    description: 'ID del estado del episodio',
    example: 'uuid-del-estado-activo',
  })
  @IsUUID()
  @IsNotEmpty()
  idEstado: string;
}