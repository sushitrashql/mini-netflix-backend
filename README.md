# 🎬 Mini Netflix API

API RESTful para gestión de series y episodios desarrollada con NestJS, PostgreSQL y TypeORM. Proyecto del Curso de Postgrado en Desarrollo de Aplicaciones Web - UPEA.

[![Node.js](https://img.shields.io/badge/Node.js-20.18.0-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)


## 📋 Requisitos

- **Node.js** >= 20.18.0
- **PostgreSQL** >= 15
- **Yarn** (gestor de paquetes)
- **Git**

## 🛠️ Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/emanuel2718/mini-netflix-backend.git
cd mini-netflix-backend
```

### 2. Instalar dependencias
```bash
yarn install
```

**`.env`**
```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Base de datos local
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=mini_netflix_db

# O usar DATABASE_URL (para Render)
# DATABASE_URL=postgresql://user:password@host:5432/database

JWT_SECRET=tu_super_secreto_cambiar_en_produccion
JWT_EXPIRATION=24h

CORS_ORIGIN=http://localhost:3000
```
## 👤 Autor

**Emanuel Aracena**
- GitHub: [@sushitrashql](https://github.com/sushitrashql)


---

**Desarrollado con ❤️ en La Paz, Bolivia**