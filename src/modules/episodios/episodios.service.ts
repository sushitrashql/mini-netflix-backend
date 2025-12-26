import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Episodio } from './entities/episodio.entity';
import { CreateEpisodioDto } from './dto/create-episodio.dto';
import { UpdateEpisodioDto } from './dto/update-episodio.dto';
import { FiltersEpisodioDto } from './dto/filters-episodio.dto';
import { EpisodioResDto } from './dto/episodio-res.dto';
import { ServiceResponse } from '../../common/interfaces/service-response.interface';
import { ResponseService } from '../../common/services/response.service';
import { ERROR_CODES } from '../../common/constants/error-codes.constant';
import { MESSAGES } from '../../common/constants/messages.constant';
import { EstadosService } from '../estados/estados.service';
import { SeriesService } from '../series/series.service';
import { ESTADO_IDENTIFIERS } from '../../common/constants/estado-identifiers.constant';

@Injectable()
export class EpisodiosService {
  constructor(
    @InjectRepository(Episodio)
    private readonly episodioRepository: Repository<Episodio>,
    private readonly estadosService: EstadosService,
    private readonly responseService: ResponseService,
  ) {}

  async create(
    createEpisodioDto: CreateEpisodioDto,
  ): Promise<ServiceResponse<EpisodioResDto>> {
    // Validar que el estado existe
    const estado = await this.estadosService.findByIdentifier(
      ESTADO_IDENTIFIERS.ACTIVO,
    );

    // Verificar que la serie existe
    const serieExists = await this.episodioRepository.manager.findOne(
      'Serie',
      {
        where: { id: createEpisodioDto.idSerie },
      },
    );

    if (!serieExists) {
      throw new NotFoundException({
        message: MESSAGES.EPISODIOS.SERIE_NOT_FOUND,
        code: ERROR_CODES.EP_SERIE_NOT_FOUND,
      });
    }

    // Verificar que no exista otro episodio con el mismo número en la misma serie
    const episodioExistente = await this.episodioRepository.findOne({
      where: {
        idSerie: createEpisodioDto.idSerie,
        numeroCapitulo: createEpisodioDto.numeroCapitulo,
      },
    });

    if (episodioExistente) {
      throw new ConflictException({
        message: MESSAGES.EPISODIOS.DUPLICATE_NUMBER,
        code: ERROR_CODES.EP_DUPLICATE_NUMBER,
      });
    }

    // Validar duración
    if (createEpisodioDto.duracion <= 0) {
      throw new BadRequestException({
        message: MESSAGES.EPISODIOS.INVALID_DURATION,
        code: ERROR_CODES.EP_INVALID_DURATION,
      });
    }

    // Crear el episodio
    const nuevoEpisodio = this.episodioRepository.create({
      ...createEpisodioDto,
      idEstado: estado.id,
    });

    const episodioGuardado = await this.episodioRepository.save(nuevoEpisodio);

    // Cargar relaciones para la respuesta
    const episodioCompleto = await this.episodioRepository.findOne({
      where: { id: episodioGuardado.id },
      relations: ['estado', 'serie'],
    });

    if (!episodioCompleto) {
      throw new NotFoundException({
        message: MESSAGES.EPISODIOS.NOT_FOUND,
        code: ERROR_CODES.EP_NOT_FOUND,
      });
    }

    return this.responseService.successCreated(
      EpisodioResDto.fromEntity(episodioCompleto),
      MESSAGES.EPISODIOS.CREATED,
    );
  }

  async findAll(
    filters: FiltersEpisodioDto,
  ): Promise<ServiceResponse<EpisodioResDto[]>> {
    const {
      page = 1,
      limit = 10,
      titulo,
      idSerie,
      idEstado,
      numeroCapitulo,
    } = filters;

    const where: FindOptionsWhere<Episodio> = {};

    if (titulo) {
      where.titulo = Like(`%${titulo}%`);
    }

    if (idSerie) {
      where.idSerie = idSerie;
    }

    if (idEstado) {
      where.idEstado = idEstado;
    }

    if (numeroCapitulo) {
      where.numeroCapitulo = numeroCapitulo;
    }

    const [episodios, total] = await this.episodioRepository.findAndCount({
      where,
      relations: ['estado', 'serie'],
      skip: (page - 1) * limit,
      take: limit,
      order: { numeroCapitulo: 'ASC', createdAt: 'DESC' },
    });

    return this.responseService.successPaginated(
      EpisodioResDto.fromEntity(episodios) as EpisodioResDto[],
      total,
      page,
      limit,
      MESSAGES.EPISODIOS.LIST_SUCCESS,
    );
  }

  async findOne(id: string): Promise<ServiceResponse<EpisodioResDto>> {
    const episodio = await this.episodioRepository.findOne({
      where: { id },
      relations: ['estado', 'serie'],
    });

    if (!episodio) {
      throw new NotFoundException({
        message: MESSAGES.EPISODIOS.NOT_FOUND,
        code: ERROR_CODES.EP_NOT_FOUND,
      });
    }

    return this.responseService.success(
      EpisodioResDto.fromEntity(episodio),
      MESSAGES.EPISODIOS.DETAIL_SUCCESS,
    );
  }

  async findBySerie(idSerie: string): Promise<ServiceResponse<EpisodioResDto[]>> {
    const episodios = await this.episodioRepository.find({
      where: { idSerie },
      relations: ['estado', 'serie'],
      order: { numeroCapitulo: 'ASC' },
    });

    return this.responseService.successList(
      EpisodioResDto.fromEntity(episodios) as EpisodioResDto[],
      MESSAGES.EPISODIOS.LIST_SUCCESS,
    );
  }

  async update(
    id: string,
    updateEpisodioDto: UpdateEpisodioDto,
  ): Promise<ServiceResponse<EpisodioResDto>> {
    const episodio = await this.episodioRepository.findOne({
      where: { id },
    });

    if (!episodio) {
      throw new NotFoundException({
        message: MESSAGES.EPISODIOS.NOT_FOUND,
        code: ERROR_CODES.EP_NOT_FOUND,
      });
    }

    // Si se está actualizando el número de capítulo, verificar que no exista otro episodio con ese número en la misma serie
    if (
      updateEpisodioDto.numeroCapitulo &&
      updateEpisodioDto.numeroCapitulo !== episodio.numeroCapitulo
    ) {
      const episodioExistente = await this.episodioRepository.findOne({
        where: {
          idSerie: episodio.idSerie,
          numeroCapitulo: updateEpisodioDto.numeroCapitulo,
        },
      });

      if (episodioExistente && episodioExistente.id !== id) {
        throw new ConflictException({
          message: MESSAGES.EPISODIOS.DUPLICATE_NUMBER,
          code: ERROR_CODES.EP_DUPLICATE_NUMBER,
        });
      }
    }

    // Validar duración si se está actualizando
    if (updateEpisodioDto.duracion && updateEpisodioDto.duracion <= 0) {
      throw new BadRequestException({
        message: MESSAGES.EPISODIOS.INVALID_DURATION,
        code: ERROR_CODES.EP_INVALID_DURATION,
      });
    }

    // Actualizar
    Object.assign(episodio, updateEpisodioDto);
    const episodioActualizado = await this.episodioRepository.save(episodio);

    // Cargar relaciones
    const episodioCompleto = await this.episodioRepository.findOne({
      where: { id: episodioActualizado.id },
      relations: ['estado', 'serie'],
    });

    if (!episodioCompleto) {
      throw new NotFoundException({
        message: MESSAGES.EPISODIOS.NOT_FOUND,
        code: ERROR_CODES.EP_NOT_FOUND,
      });
    }

    return this.responseService.successUpdated(
      EpisodioResDto.fromEntity(episodioCompleto),
      MESSAGES.EPISODIOS.UPDATED,
    );
  }

  async remove(id: string): Promise<ServiceResponse<EpisodioResDto>> {
    const episodio = await this.episodioRepository.findOne({
      where: { id },
      relations: ['estado', 'serie'],
    });

    if (!episodio) {
      throw new NotFoundException({
        message: MESSAGES.EPISODIOS.NOT_FOUND,
        code: ERROR_CODES.EP_NOT_FOUND,
      });
    }

    // Soft delete
    await this.episodioRepository.softRemove(episodio);

    return this.responseService.successDeleted(
      EpisodioResDto.fromEntity(episodio),
      MESSAGES.EPISODIOS.DELETED,
    );
  }
}