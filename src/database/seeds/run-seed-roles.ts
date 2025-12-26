import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Definir la estructura del rol directamente sin importar la entidad
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
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Usar query builder directo sin importar entidades
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
      await queryRunner.query(
        `INSERT INTO roles (id, nombre, descripcion, identificador, created_at, updated_at) 
         VALUES (uuid_generate_v4(), $1, $2, $3, NOW(), NOW())`,
        [rolData.nombre, rolData.descripcion, rolData.identificador],
      );
      console.log(`✅ Rol creado: ${rolData.identificador}`);
    }

    await queryRunner.release();
    console.log('🎉 Seed de roles completado exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();