import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuarioRol } from '../usuarios/entities/usuario-rol.entity';
import { Rol } from '../roles/entities/rol.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, UsuarioResDto } from './dto/auth-res.dto';
import { ServiceResponse } from '../../common/interfaces/service-response.interface';
import { ResponseService } from '../../common/services/response.service';
import { EstadosService } from '../estados/estados.service';
import { ERROR_CODES } from '../../common/constants/error-codes.constant';
import { MESSAGES } from '../../common/constants/messages.constant';
import { ESTADO_IDENTIFIERS } from '../../common/constants/estado-identifiers.constant';
import { ROL_IDENTIFIERS } from '../../common/constants/rol-identifiers.constant';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolRepository: Repository<UsuarioRol>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly jwtService: JwtService,
    private readonly estadosService: EstadosService,
    private readonly responseService: ResponseService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<ServiceResponse<AuthResponseDto>> {
    const { usuario, email, password, rolesIds, ...rest } = registerDto;

    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: [{ usuario }, { email }],
    });

    if (usuarioExistente) {
      throw new ConflictException({
        message: 'El usuario o email ya existe',
        code: ERROR_CODES.GEN_CONFLICT,
      });
    }

    // Obtener estado activo
    const estado = await this.estadosService.findByIdentifier(
      ESTADO_IDENTIFIERS.ACTIVO,
    );

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = this.usuarioRepository.create({
      usuario,
      email,
      password: hashedPassword,
      idEstado: estado.id,
      ...rest,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    // Asignar roles
    let roles: Rol[] = [];
    if (rolesIds && rolesIds.length > 0) {
      roles = await this.rolRepository.findByIds(rolesIds);
    } else {
      // Si no se especifican roles, asignar rol USER por defecto
      const rolUser = await this.rolRepository.findOne({
        where: { identificador: ROL_IDENTIFIERS.USER },
      });
      if (rolUser) {
        roles = [rolUser];
      }
    }

    // Crear relaciones usuario-rol
    const usuarioRoles = roles.map((rol) =>
      this.usuarioRolRepository.create({
        idUsuario: usuarioGuardado.id,
        idRol: rol.id,
      }),
    );

    await this.usuarioRolRepository.save(usuarioRoles);

    // Cargar usuario completo con relaciones
    const usuarioCompleto = await this.usuarioRepository.findOne({
      where: { id: usuarioGuardado.id },
      relations: ['estado', 'usuarioRoles', 'usuarioRoles.rol'],
    });

    if (!usuarioCompleto) {
      throw new Error('Error al cargar el usuario registrado');
    }

    // Generar token
    const accessToken = this.generateToken(usuarioCompleto);

    const authResponse: AuthResponseDto = {
      accessToken,
      usuario: this.transformUsuario(usuarioCompleto),
    };

    return this.responseService.successCreated(
      authResponse,
      'Usuario registrado exitosamente',
    );
  }

  async login(loginDto: LoginDto): Promise<ServiceResponse<AuthResponseDto>> {
    const { usuario, password } = loginDto;

    // Buscar usuario por usuario o email
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: [{ usuario }, { email: usuario }],
      select: ['id', 'usuario', 'email', 'password', 'nombre', 'apellido', 'idEstado'],
      relations: ['estado', 'usuarioRoles', 'usuarioRoles.rol'],
    });

    if (!usuarioEncontrado) {
      throw new UnauthorizedException({
        message: MESSAGES.AUTH.INVALID_CREDENTIALS,
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      password,
      usuarioEncontrado.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: MESSAGES.AUTH.INVALID_CREDENTIALS,
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      });
    }

    // Verificar si está activo
    if (usuarioEncontrado.estado.identificador !== ESTADO_IDENTIFIERS.ACTIVO) {
      throw new UnauthorizedException({
        message: MESSAGES.AUTH.USER_INACTIVE,
        code: ERROR_CODES.AUTH_USER_INACTIVE,
      });
    }

    // Generar token
    const accessToken = this.generateToken(usuarioEncontrado);

    const authResponse: AuthResponseDto = {
      accessToken,
      usuario: this.transformUsuario(usuarioEncontrado),
    };

    return this.responseService.success(
      authResponse,
      MESSAGES.AUTH.LOGIN_SUCCESS,
    );
  }

  private generateToken(usuario: Usuario): string {
    const roles = usuario.usuarioRoles.map((ur) => ur.rol.identificador);

    const payload: JwtPayload = {
      sub: usuario.id,
      usuario: usuario.usuario,
      email: usuario.email,
      roles,
    };

    return this.jwtService.sign(payload);
  }

  private transformUsuario(usuario: Usuario): UsuarioResDto {
    const roles = usuario.usuarioRoles.map((ur) => ({
      id: ur.rol.id,
      nombre: ur.rol.nombre,
      descripcion: ur.rol.descripcion,
      identificador: ur.rol.identificador,
    }));

    return {
      id: usuario.id,
      usuario: usuario.usuario,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      idEstado: usuario.idEstado,
      estado: {
        id: usuario.estado.id,
        descripcion: usuario.estado.descripcion,
        valor: usuario.estado.valor,
        identificador: usuario.estado.identificador,
      },
      roles,
    } as UsuarioResDto;
  }
}