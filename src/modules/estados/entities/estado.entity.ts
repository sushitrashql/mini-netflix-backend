import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('estados')
export class Estado extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  descripcion: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  valor: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  identificador: string;

  // Relación recursiva - Estado puede tener un estado padre
  @ManyToOne(() => Estado, (estado) => estado.estadosHijos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_estado' })
  estado: Estado;

  @Column({
    type: 'uuid',
    name: 'id_estado',
    nullable: true,
  })
  idEstado: string;

  // Relación recursiva - Estado puede tener múltiples estados hijos
  @OneToMany(() => Estado, (estado) => estado.estado)
  estadosHijos: Estado[];
}