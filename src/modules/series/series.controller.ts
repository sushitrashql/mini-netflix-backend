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
import { SeriesService } from './series.service';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { FiltersSerieDto } from './dto/filters-serie.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ROL_IDENTIFIERS } from '../../common/constants/rol-identifiers.constant';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  @Roles(ROL_IDENTIFIERS.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear una nueva serie' })
  @ApiResponse({ status: 201, description: 'Serie creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'La serie ya existe' })
  create(@Body() createSerieDto: CreateSerieDto) {
    return this.seriesService.create(createSerieDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas las series con filtros' })
  @ApiResponse({ status: 200, description: 'Listado de series obtenido' })
  findAll(@Query() filters: FiltersSerieDto) {
    return this.seriesService.findAll(filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una serie' })
  @ApiResponse({ status: 200, description: 'Serie encontrada' })
  @ApiResponse({ status: 404, description: 'Serie no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.seriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROL_IDENTIFIERS.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar una serie' })
  @ApiResponse({ status: 200, description: 'Serie actualizada' })
  @ApiResponse({ status: 404, description: 'Serie no encontrada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSerieDto: UpdateSerieDto,
  ) {
    return this.seriesService.update(id, updateSerieDto);
  }

  @Delete(':id')
  @Roles(ROL_IDENTIFIERS.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una serie' })
  @ApiResponse({ status: 200, description: 'Serie eliminada' })
  @ApiResponse({ status: 404, description: 'Serie no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.seriesService.remove(id);
  }
}