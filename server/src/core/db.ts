import { DataSourceOptions, DataSource } from 'typeorm';
import { dbConfig } from '@/interfaces';
import config from 'config';

const { host, port, database, user, password, synchronize, entities }: dbConfig = config.get('dbConfig');

const dbConnection: DataSourceOptions = {
  type: 'postgres',
  url: '',
  host: host,
  port: port,
  username: user,
  password: password,
  database: database,
  synchronize: synchronize,
  logging: false,
  cache: false,
  entities: entities,
};

export const dataSource = new DataSource(dbConnection);
