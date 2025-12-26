import { Expose, Type, plainToInstance } from 'class-transformer';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EstadoResDto } from '../../estados/dto/estado-res.dto';

export class RolResDto {
  @Expose()
  id: string;

  @Expose()
  nombre: string;

  @Expose()
  descripcion: string;

  @Expose()
  identificador: string;
}

export class UsuarioResDto {
  @Expose()
  id: string;

  @Expose()
  usuario: string;

  @Expose()
  email: string;

  @Expose()
  nombre: string;

  @Expose()
  apellido: string;

  @Expose()
  idEstado: string;

  @Expose()
  @Type(() => EstadoResDto)
  estado: EstadoResDto;

  @Expose()
  @Type(() => RolResDto)
  roles: RolResDto[];

  static fromEntity(entity: Usuario): UsuarioResDto;
  static fromEntity(entity: Usuario[]): UsuarioResDto[];
  static fromEntity(
    entity: Usuario | Usuario[],
  ): UsuarioResDto | UsuarioResDto[] {
    return plainToInstance(UsuarioResDto, entity, {
      excludeExtraneousValues: true,
    });
  }
}

export class AuthResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => UsuarioResDto)
  usuario: UsuarioResDto;
}