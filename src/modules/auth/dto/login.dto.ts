import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Usuario o email',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @ApiProperty({
    description: 'Contraseña',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}