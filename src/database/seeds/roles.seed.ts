import { Rol } from '../../modules/roles/entities/rol.entity';

export const rolesSeed: Partial<Rol>[] = [
  {
    nombre: 'Administrador',
    descripcion: 'Acceso total al sistema',
    identificador: 'ADMIN',
  },
  {
    nombre: 'Usuario',
    descripcion: 'Usuario estándar del sistema',
    identificador: 'USER',
  },
];