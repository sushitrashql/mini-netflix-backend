import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

interface EstadoSeed {
  descripcion: string;
  valor: string;
  identificador: string;
}

const estadosSeed: EstadoSeed[] = [
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

    const queryRunner = dataSource.createQueryRunner();

    // Verificar si ya existen estados
    const countResult = await queryRunner.query(
      'SELECT COUNT(*) as count FROM estados',
    );
    const count = parseInt(countResult[0].count, 10);

    if (count > 0) {
      console.log('⚠️  Ya existen estados en la base de datos');
      await queryRunner.release();
      return;
    }

    // Insertar estados
    for (const estadoData of estadosSeed) {
      const id = uuidv4();
      await queryRunner.query(
        `INSERT INTO estados (id, descripcion, valor, identificador, created_at, updated_at, created_by, updated_by, id_estado) 
         VALUES ($1, $2, $3, $4, NOW(), NOW(), NULL, NULL, NULL)`,
        [id, estadoData.descripcion, estadoData.valor, estadoData.identificador],
      );
      console.log(`✅ Estado creado: ${estadoData.identificador} (${id})`);
    }

    await queryRunner.release();
    console.log('🎉 Seed de estados completado exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();