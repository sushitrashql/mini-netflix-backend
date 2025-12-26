import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  BeforeSoftRemove,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Campos de Auditoría
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'uuid',
    name: 'created_by',
    nullable: true,
  })
  createdBy: string | null;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'uuid',
    name: 'updated_by',
    nullable: true,
  })
  updatedBy: string | null;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date | null;

  @Column({
    type: 'uuid',
    name: 'deleted_by',
    nullable: true,
  })
  deletedBy?: string | null;

  // Hooks para registrar auditoría automáticamente
  @BeforeInsert()
  setCreatedBy() {
    if (!this.createdBy) {
      this.createdBy = null;
    }
  }

  @BeforeUpdate()
  setUpdatedBy() {
    if (!this.updatedBy) {
      this.updatedBy = null;
    }
  }

  @BeforeSoftRemove()
  setDeletedBy() {
    if (!this.deletedBy) {
      this.deletedBy = null;
    }
  }
}