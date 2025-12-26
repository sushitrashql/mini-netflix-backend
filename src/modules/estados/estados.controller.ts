import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EstadosService } from './estados.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Estados')
@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los estados' })
  @ApiResponse({ status: 200, description: 'Listado de estados obtenido' })
  async findAll() {
    return this.estadosService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado por ID' })
  @ApiResponse({ status: 200, description: 'Estado encontrado' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estadosService.findOne(id);
  }

  @Public()
  @Get('identificador/:identificador')
  @ApiOperation({ summary: 'Obtener un estado por identificador' })
  @ApiResponse({ status: 200, description: 'Estado encontrado' })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  async findByIdentifier(@Param('identificador') identificador: string) {
    return this.estadosService.findByIdentifierPublic(identificador);
  }
}