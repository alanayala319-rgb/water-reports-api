import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envs } from '../config/envs';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';

/**
 * DataSource utilizado exclusivamente por el CLI de TypeORM para
 * generar/ejecutar/revertir migraciones (npm run migration:*).
 * La aplicacion NestJS en si misma usa TypeOrmModule.forRootAsync
 * (ver database.module.ts), pero comparte la misma configuracion
 * base para evitar desincronizaciones entre ambos.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.dbHost,
  port: envs.dbPort,
  username: envs.dbUsername,
  password: envs.dbPassword,
  database: envs.dbName,
  synchronize: false,
  logging: false,
  entities: [Report, User],
  migrations: ['src/database/migrations/*.ts'],
});
