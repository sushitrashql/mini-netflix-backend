import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EpisodiosService } from './episodios.service';
import { CreateEpisodioDto } from './dto/create-episodio.dto';
import { UpdateEpisodioDto } from './dto/update-episodio.dto';
import { FiltersEpisodioDto } from './dto/filters-episodio.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ROL_IDENTIFIERS } from '../../common/constants/rol-identifiers.constant';

@ApiTags('Episodios')
@Controller('episodios')
export class EpisodiosController {
  constructor(private readonly episodiosService: EpisodiosService) {}

  @Post()
  @Roles(ROL_IDENTIFIERS.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear un nuevo episodio' })
  @ApiResponse({ status: 201, description: 'Episodio creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Serie no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe episodio con ese número' })
  create(@Body() createEpisodioDto: CreateEpisodioDto) {
    return this.episodiosService.create(createEpisodioDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los episodios con filtros' })
  @ApiResponse({ status: 200, description: 'Listado de episodios obtenido' })
  findAll(@Query() filters: FiltersEpisodioDto) {
    return this.episodiosService.findAll(filters);
  }

  @Public()
  @Get('serie/:idSerie')
  @ApiOperation({ summary: 'Obtener todos los episodios de una serie' })
  @ApiResponse({ status: 200, description: 'Episodios de la serie obtenidos' })
  findBySerie(@Param('idSerie', ParseUUIDPipe) idSerie: string) {
    return this.episodiosService.findBySerie(idSerie);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un episodio' })
  @ApiResponse({ status: 200, description: 'Episodio encontrado' })
  @ApiResponse({ status: 404, description: 'Episodio no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.episodiosService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROL_IDENTIFIERS.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar un episodio' })
  @ApiResponse({ status: 200, description: 'Episodio actualizado' })
  @ApiResponse({ status: 404, description: 'Episodio no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto con número de capítulo' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEpisodioDto: UpdateEpisodioDto,
  ) {
    return this.episodiosService.update(id, updateEpisodioDto);
  }

  @Delete(':id')
  @Roles(ROL_IDENTIFIERS.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar un episodio' })
  @ApiResponse({ status: 200, description: 'Episodio eliminado' })
  @ApiResponse({ status: 404, description: 'Episodio no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.episodiosService.remove(id);
  }
}