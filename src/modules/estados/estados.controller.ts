import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EstadosService } from './estados.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Estados')
@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los estados' })
  async findAll() {
    const estados = await this.estadosService.findAll();
    return {
      success: true,
      message: 'Listado de estados obtenido exitosamente',
      data: estados,
    };
  }
}