import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { Serie } from '../../series/entities/serie.entity';

@Entity('episodios')
export class Episodio extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  titulo: string;

  @Column({
    type: 'int',
    nullable: false,
    comment: 'Duración en minutos',
  })
  duracion: number;

  @Column({
    type: 'int',
    name: 'numero_capitulo',
    nullable: false,
  })
  numeroCapitulo: number;

  // Relación con Serie (Many to One) - La regla de oro
  @ManyToOne(() => Serie, (serie) => serie.episodios, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_serie' })
  serie: Serie;

  @Column({
    type: 'uuid',
    name: 'id_serie',
    nullable: false,
  })
  idSerie: string;

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
}