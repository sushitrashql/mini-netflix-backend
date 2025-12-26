import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'emanuel',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  usuario: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'emanuel@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Nombre',
    example: 'Emanuel',
    required: false,
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    description: 'Apellido',
    example: 'García',
    required: false,
  })
  @IsString()
  @IsOptional()
  apellido?: string;

  @ApiProperty({
    description: 'IDs de roles a asignar',
    example: ['uuid-rol-user'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  rolesIds?: string[];
}