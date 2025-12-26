import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Usuario } from './usuario.entity';
import { Rol } from '../../roles/entities/rol.entity';

@Entity('usuario_roles')
export class UsuarioRol extends BaseEntity {
  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({
    type: 'uuid',
    name: 'id_usuario',
    nullable: false,
  })
  idUsuario: string;

  // Relación con Rol
  @ManyToOne(() => Rol, (rol) => rol.usuarioRoles, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @Column({
    type: 'uuid',
    name: 'id_rol',
    nullable: false,
  })
  idRol: string;
}