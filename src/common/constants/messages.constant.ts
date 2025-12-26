export const MESSAGES = {
  // Mensajes Generales
  GENERAL: {
    SUCCESS: 'Operación exitosa',
    CREATED: 'Recurso creado exitosamente',
    UPDATED: 'Recurso actualizado exitosamente',
    DELETED: 'Recurso eliminado exitosamente',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION_ERROR: 'Error de validación en los datos enviados',
    INTERNAL_ERROR: 'Error interno del servidor',
    BAD_REQUEST: 'Solicitud inválida',
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso prohibido',
    CONFLICT: 'Conflicto con el estado actual del recurso',
  },

  // Mensajes de Autenticación
  AUTH: {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGIN_FAILED: 'Credenciales inválidas',
    LOGOUT_SUCCESS: 'Cierre de sesión exitoso',
    TOKEN_EXPIRED: 'Token expirado',
    TOKEN_INVALID: 'Token inválido',
    TOKEN_MISSING: 'Token no proporcionado',
    INSUFFICIENT_PERMISSIONS: 'Permisos insuficientes',
    USER_NOT_FOUND: 'Usuario no encontrado',
    USER_INACTIVE: 'Usuario inactivo',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
  },

  // Mensajes de Series
  SERIES: {
    CREATED: 'Serie creada exitosamente',
    UPDATED: 'Serie actualizada exitosamente',
    DELETED: 'Serie eliminada exitosamente',
    NOT_FOUND: 'Serie no encontrada',
    LIST_SUCCESS: 'Listado de series obtenido exitosamente',
    DETAIL_SUCCESS: 'Detalle de serie obtenido exitosamente',
    ALREADY_EXISTS: 'Ya existe una serie con ese título',
    HAS_EPISODES: 'No se puede eliminar la serie porque tiene episodios asociados',
    INACTIVE: 'La serie está inactiva',
  },

  // Mensajes de Episodios
  EPISODIOS: {
    CREATED: 'Episodio creado exitosamente',
    UPDATED: 'Episodio actualizado exitosamente',
    DELETED: 'Episodio eliminado exitosamente',
    NOT_FOUND: 'Episodio no encontrado',
    LIST_SUCCESS: 'Listado de episodios obtenido exitosamente',
    DETAIL_SUCCESS: 'Detalle de episodio obtenido exitosamente',
    SERIE_NOT_FOUND: 'La serie asociada no existe',
    DUPLICATE_NUMBER: 'Ya existe un episodio con ese número en la serie',
    INVALID_DURATION: 'La duración debe ser mayor a 0',
    SERIE_REQUIRED: 'Se debe especificar una serie',
  },

  // Mensajes de Estados
  ESTADOS: {
    CREATED: 'Estado creado exitosamente',
    UPDATED: 'Estado actualizado exitosamente',
    DELETED: 'Estado eliminado exitosamente',
    NOT_FOUND: 'Estado no encontrado',
    LIST_SUCCESS: 'Listado de estados obtenido exitosamente',
    DETAIL_SUCCESS: 'Detalle de estado obtenido exitosamente',
    INVALID_IDENTIFIER: 'Identificador de estado inválido',
    INACTIVE: 'El estado está inactivo',
    IN_USE: 'No se puede eliminar el estado porque está en uso',
  },
};