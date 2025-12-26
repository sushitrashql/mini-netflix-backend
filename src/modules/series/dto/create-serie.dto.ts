import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateSerieDto {
  @ApiProperty({
    description: 'Título de la serie',
    example: 'Stranger Things',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiProperty({
    description: 'Género de la serie',
    example: 'Ciencia Ficción',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  genero: string;

  @ApiProperty({
    description: 'Sinopsis de la serie',
    example: 'Una serie sobre eventos sobrenaturales en un pequeño pueblo...',
    required: false,
  })
  @IsString()
  @IsOptional()
  sinopsis?: string;

  @ApiProperty({
    description: 'URL de la portada de la serie',
    example: 'https://example.com/portada.jpg',
    required: false,
    maxLength: 500,
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  urlPortada?: string;

  @ApiProperty({
    description: 'ID del estado de la serie',
    example: 'uuid-del-estado-activo',
  })
  @IsUUID()
  @IsNotEmpty()
  idEstado: string;
}