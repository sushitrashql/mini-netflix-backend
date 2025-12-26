import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { Episodio } from '../../episodios/entities/episodio.entity';

@Entity('series')
export class Serie extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  titulo: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  genero: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  sinopsis: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'url_portada',
    nullable: true,
  })
  urlPortada: string;

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

  // Relación con Episodios (One to Many)
  @OneToMany(() => Episodio, (episodio) => episodio.serie, {
    cascade: true,
  })
  episodios: Episodio[];
}