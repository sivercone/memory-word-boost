import config from 'config';
import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { dbConfig } from '@interfaces/db.interface';

const { host, port, database, user, password }: dbConfig = config.get('dbConfig');

export const dbConnection: ConnectionOptions = {
  type: 'postgres',
  url: '',
  host: host,
  port: port,
  username: user,
  password: password,
  database: database,
  synchronize: true,
  logging: false,
  cache: false,
  entities: ['src/entity/*{.ts,.js}'],
  migrations: [path.join(__dirname, '../**/*.migration{.ts,.js}')],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migrations',
  },
};
