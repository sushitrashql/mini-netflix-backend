import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { EstadoResDto } from './dto/estado-res.dto';
import { ServiceResponse } from '../../common/interfaces/service-response.interface';
import { ResponseService } from '../../common/services/response.service';
import { ERROR_CODES } from '../../common/constants/error-codes.constant';
import { MESSAGES } from '../../common/constants/messages.constant';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
    private readonly responseService: ResponseService,
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

  async findAll(): Promise<ServiceResponse<EstadoResDto[]>> {
    const estados = await this.estadoRepository.find({
      relations: ['estado', 'estadosHijos'],
      order: { descripcion: 'ASC' },
    });

    return this.responseService.successList(
      EstadoResDto.fromEntity(estados) as EstadoResDto[],
      MESSAGES.ESTADOS.LIST_SUCCESS,
    );
  }

  async findOne(id: string): Promise<ServiceResponse<EstadoResDto>> {
    const estado = await this.estadoRepository.findOne({
      where: { id },
      relations: ['estado', 'estadosHijos'],
    });

    if (!estado) {
      throw new NotFoundException({
        message: MESSAGES.ESTADOS.NOT_FOUND,
        code: ERROR_CODES.EST_NOT_FOUND,
      });
    }

    return this.responseService.success(
      EstadoResDto.fromEntity(estado),
      MESSAGES.ESTADOS.DETAIL_SUCCESS,
    );
  }

  async findByIdentifierPublic(
    identificador: string,
  ): Promise<ServiceResponse<EstadoResDto>> {
    const estado = await this.estadoRepository.findOne({
      where: { identificador },
    });

    if (!estado) {
      throw new NotFoundException({
        message: MESSAGES.ESTADOS.NOT_FOUND,
        code: ERROR_CODES.EST_NOT_FOUND,
      });
    }

    return this.responseService.success(
      EstadoResDto.fromEntity(estado),
      MESSAGES.ESTADOS.DETAIL_SUCCESS,
    );
  }
}