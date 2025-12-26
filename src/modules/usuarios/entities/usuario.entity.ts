import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { UsuarioRol } from './usuario-rol.entity';

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  usuario: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apellido: string;

  // Relación con Estado
  @ManyToOne(() => Estado, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'id_estado' })
  estado: Estado;

  @Column({
    type: 'uuid',
    name: 'id_estado',
    nullable: false,
  })
  idEstado: string;

  // Relación Many-to-Many con Rol a través de UsuarioRol
  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario, {
    cascade: true,
  })
  usuarioRoles: UsuarioRol[];
}