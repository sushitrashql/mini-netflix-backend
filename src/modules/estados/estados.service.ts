import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { ERROR_CODES } from '../../common/constants/error-codes.constant';
import { MESSAGES } from '../../common/constants/messages.constant';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  async findByIdentifier(identificador: string): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({
      where: { identificador },
    });

    if (!estado) {
      throw new NotFoundException({
        message: MESSAGES.ESTADOS.NOT_FOUND,
        code: ERROR_CODES.EST_NOT_FOUND,
      });
    }

    return estado;
  }

  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.find({
      relations: ['estado', 'estadosHijos'],
    });
  }
}