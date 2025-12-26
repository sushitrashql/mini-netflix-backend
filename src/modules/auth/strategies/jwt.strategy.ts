import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ERROR_CODES } from '../../../common/constants/error-codes.constant';
import { MESSAGES } from '../../../common/constants/messages.constant';

export interface JwtPayload {
  sub: string; 
  usuario: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    const { sub } = payload;

    const usuario = await this.usuarioRepository.findOne({
      where: { id: sub },
      relations: ['estado', 'usuarioRoles', 'usuarioRoles.rol'],
    });

    if (!usuario) {
      throw new UnauthorizedException({
        message: MESSAGES.AUTH.USER_NOT_FOUND,
        code: ERROR_CODES.AUTH_USER_NOT_FOUND,
      });
    }

    // Verificar si el usuario está activo
    if (usuario.estado.identificador !== 'ACTIVO') {
      throw new UnauthorizedException({
        message: MESSAGES.AUTH.USER_INACTIVE,
        code: ERROR_CODES.AUTH_USER_INACTIVE,
      });
    }

    return usuario;
  }
}