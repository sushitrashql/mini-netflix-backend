import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Serie } from './entities/serie.entity';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { FiltersSerieDto } from './dto/filters-serie.dto';
import { SerieResDto } from './dto/serie-res.dto';
import { ServiceResponse } from '../../common/interfaces/service-response.interface';
import { ResponseService } from '../../common/services/response.service';
import { ERROR_CODES } from '../../common/constants/error-codes.constant';
import { MESSAGES } from '../../common/constants/messages.constant';
import { EstadosService } from '../estados/estados.service';
import { ESTADO_IDENTIFIERS } from '../../common/constants/estado-identifiers.constant';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Serie)
    private readonly serieRepository: Repository<Serie>,
    private readonly estadosService: EstadosService,
    private readonly responseService: ResponseService,
  ) {}

  async create(
    createSerieDto: CreateSerieDto,
  ): Promise<ServiceResponse<SerieResDto>> {
    // Validar que el estado existe
    const estado = await this.estadosService.findByIdentifier(
      ESTADO_IDENTIFIERS.ACTIVO,
    );

    // Verificar si ya existe una serie con el mismo título
    const serieExistente = await this.serieRepository.findOne({
      where: { titulo: createSerieDto.titulo },
    });

    if (serieExistente) {
      throw new ConflictException({
        message: MESSAGES.SERIES.ALREADY_EXISTS,
        code: ERROR_CODES.SERIE_ALREADY_EXISTS,
      });
    }

    // Crear la serie
    const nuevaSerie = this.serieRepository.create({
      ...createSerieDto,
      idEstado: estado.id,
    });

    const serieGuardada = await this.serieRepository.save(nuevaSerie);

    // Cargar relaciones para la respuesta
    const serieCompleta = await this.serieRepository.findOne({
      where: { id: serieGuardada.id },
      relations: ['estado'],
    });

    if (!serieCompleta) {
      throw new NotFoundException({
        message: MESSAGES.SERIES.NOT_FOUND,
        code: ERROR_CODES.SERIE_NOT_FOUND,
      });
    }

    return this.responseService.successCreated(
      SerieResDto.fromEntity(serieCompleta),
      MESSAGES.SERIES.CREATED,
    );
  }

  async findAll(
    filters: FiltersSerieDto,
  ): Promise<ServiceResponse<SerieResDto[]>> {
    const { page = 1, limit = 10, titulo, genero, idEstado } = filters;

    const where: FindOptionsWhere<Serie> = {};

    if (titulo) {
      where.titulo = Like(`%${titulo}%`);
    }

    if (genero) {
      where.genero = Like(`%${genero}%`);
    }

    if (idEstado) {
      where.idEstado = idEstado;
    }

    const [series, total] = await this.serieRepository.findAndCount({
      where,
      relations: ['estado'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return this.responseService.successPaginated(
      SerieResDto.fromEntity(series) as SerieResDto[],
      total,
      page,
      limit,
      MESSAGES.SERIES.LIST_SUCCESS,
    );
  }

 async findOne(id: string): Promise<ServiceResponse<SerieResDto>> {
  const serie = await this.serieRepository.findOne({
    where: { id },
    relations: ['estado', 'episodios', 'episodios.estado'],
  });

  if (!serie) {
    throw new NotFoundException({
      message: MESSAGES.SERIES.NOT_FOUND,
      code: ERROR_CODES.SERIE_NOT_FOUND,
    });
  }

  return this.responseService.success(
    SerieResDto.fromEntity(serie),
    MESSAGES.SERIES.DETAIL_SUCCESS,
  );
}

  async update(
    id: string,
    updateSerieDto: UpdateSerieDto,
  ): Promise<ServiceResponse<SerieResDto>> {
    const serie = await this.serieRepository.findOne({
      where: { id },
    });

    if (!serie) {
      throw new NotFoundException({
        message: MESSAGES.SERIES.NOT_FOUND,
        code: ERROR_CODES.SERIE_NOT_FOUND,
      });
    }

    // Si se está actualizando el título, verificar que no exista otra serie con ese título
    if (updateSerieDto.titulo && updateSerieDto.titulo !== serie.titulo) {
      const serieExistente = await this.serieRepository.findOne({
        where: { titulo: updateSerieDto.titulo },
      });

      if (serieExistente) {
        throw new ConflictException({
          message: MESSAGES.SERIES.ALREADY_EXISTS,
          code: ERROR_CODES.SERIE_ALREADY_EXISTS,
        });
      }
    }

    // Actualizar
    Object.assign(serie, updateSerieDto);
    const serieActualizada = await this.serieRepository.save(serie);

    // Cargar relaciones
    const serieCompleta = await this.serieRepository.findOne({
      where: { id: serieActualizada.id },
      relations: ['estado'],
    });

    if (!serieCompleta) {
      throw new NotFoundException({
        message: MESSAGES.SERIES.NOT_FOUND,
        code: ERROR_CODES.SERIE_NOT_FOUND,
      });
    }

    return this.responseService.successUpdated(
      SerieResDto.fromEntity(serieCompleta),
      MESSAGES.SERIES.UPDATED,
    );
  }

  async remove(id: string): Promise<ServiceResponse<SerieResDto>> {
    const serie = await this.serieRepository.findOne({
      where: { id },
      relations: ['episodios'],
    });

    if (!serie) {
      throw new NotFoundException({
        message: MESSAGES.SERIES.NOT_FOUND,
        code: ERROR_CODES.SERIE_NOT_FOUND,
      });
    }

    // Verificar si tiene episodios
    if (serie.episodios && serie.episodios.length > 0) {
      throw new BadRequestException({
        message: MESSAGES.SERIES.HAS_EPISODES,
        code: ERROR_CODES.SERIE_HAS_EPISODES,
      });
    }

    // Soft delete
    await this.serieRepository.softRemove(serie);

    return this.responseService.successDeleted(
      SerieResDto.fromEntity(serie),
      MESSAGES.SERIES.DELETED,
    );
  }
}