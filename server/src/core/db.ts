import { DataSourceOptions, DataSource } from 'typeorm';
import { dbConfig } from '@/interfaces';
import config from 'config';
import path from 'path';

const { host, port, database, user, password }: dbConfig = config.get('dbConfig');

const dbConnection: DataSourceOptions = {
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
  entities: ['src/entities/*{.ts,.js}'],
  migrations: [path.join(__dirname, '../**/*.migration{.ts,.js}')],
};

export const dataSource = new DataSource(dbConnection);
