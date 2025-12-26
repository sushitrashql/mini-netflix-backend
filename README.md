# 🎬 Mini Netflix API

API RESTful para gestión de series y episodios desarrollada con NestJS, PostgreSQL y TypeORM proyecto de Curso de Posgrado UPEA.

## 🚀 Características

- ✅ Autenticación JWT con roles (Admin/User)
- ✅ CRUD completo de Series y Episodios
- ✅ Relaciones Many-to-Many entre Usuarios y Roles
- ✅ Soft Delete y auditoría completa
- ✅ Manejo de errores centralizado
- ✅ Respuestas estandarizadas (ServiceResponse)
- ✅ Validaciones con class-validator
- ✅ Documentación con Swagger
- ✅ Paginación y filtros

## 📋 Requisitos

- Node.js >= 20.18.0
- PostgreSQL >= 14
- Yarn

## 🛠️ Instalación Local
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mini-netflix-backend.git
cd mini-netflix-backend

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar seeds
yarn seed:estados
yarn seed:roles

# Iniciar en modo desarrollo
yarn start:dev
```

## 🌐 Variables de Entorno
```env
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

DB_HOST=tu-host-postgres.render.com
DB_PORT=5432
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-password
DB_DATABASE=mini_netflix_db

JWT_SECRET=tu-super-secreto-seguro
JWT_EXPIRATION=24h

CORS_ORIGIN=https://tu-frontend.com
```

## 📚 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión

### Series (GET público, POST/PATCH/DELETE requiere ADMIN)
- `GET /api/v1/series` - Listar series
- `GET /api/v1/series/:id` - Obtener serie
- `POST /api/v1/series` - Crear serie
- `PATCH /api/v1/series/:id` - Actualizar serie
- `DELETE /api/v1/series/:id` - Eliminar serie

### Episodios (GET público, POST/PATCH/DELETE requiere ADMIN)
- `GET /api/v1/episodios` - Listar episodios
- `GET /api/v1/episodios/:id` - Obtener episodio
- `GET /api/v1/episodios/serie/:idSerie` - Episodios de una serie
- `POST /api/v1/episodios` - Crear episodio
- `PATCH /api/v1/episodios/:id` - Actualizar episodio
- `DELETE /api/v1/episodios/:id` - Eliminar episodio

## 🧪 Testing
```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📦 Build
```bash
yarn build
yarn start:prod
```

## 👤 Autor

**Emanuel García**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 📄 Licencia

MIT