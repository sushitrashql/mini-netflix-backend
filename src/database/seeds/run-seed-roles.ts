import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

interface RolSeed {
  nombre: string;
  descripcion: string;
  identificador: string;
}

const rolesSeed: RolSeed[] = [
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

async function runSeed() {
  // Configuración usando DATABASE_URL o credenciales individuales
  const dataSourceConfig = process.env.DATABASE_URL
    ? {
        type: 'postgres' as const,
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: false,
      }
    : {
        type: 'postgres' as const,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
        ssl: false,
      };

  const dataSource = new DataSource(dataSourceConfig);

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    const queryRunner = dataSource.createQueryRunner();

    // Verificar si ya existen roles
    const countResult = await queryRunner.query(
      'SELECT COUNT(*) as count FROM roles',
    );
    const count = parseInt(countResult[0].count, 10);

    if (count > 0) {
      console.log('⚠️  Ya existen roles en la base de datos');
      await queryRunner.release();
      return;
    }

    // Insertar roles
    for (const rolData of rolesSeed) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO roles (id, nombre, descripcion, identificador, created_at, updated_at, created_by, updated_by) 
         VALUES ($1, $2, $3, $4, NOW(), NOW(), NULL, NULL)`,
        [id, rolData.nombre, rolData.descripcion, rolData.identificador],
      );
      console.log(`✅ Rol creado: ${rolData.identificador} (${id})`);
    }

    await queryRunner.release();
    console.log('🎉 Seed de roles completado exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeed();