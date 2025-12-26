import { Estado } from '../../modules/estados/entities/estado.entity';

export const estadosSeed: Partial<Estado>[] = [
  {
    descripcion: 'Registro activo y disponible',
    valor: '1',
    identificador: 'ACTIVO',
  },
  {
    descripcion: 'Registro inactivo temporalmente',
    valor: '0',
    identificador: 'INACTIVO',
  },
  {
    descripcion: 'Registro eliminado lógicamente',
    valor: '-1',
    identificador: 'ELIMINADO',
  },
];