import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UsuarioRol } from 'src/modules/usuarios/entities/usuario-rol.entity';

@Entity('roles')
export class Rol extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  identificador: string;

  // Relación Many-to-Many con Usuario a través de UsuarioRol
  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  usuarioRoles: UsuarioRol[];
}