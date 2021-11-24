import config from 'config';
import { dbConfig } from '@interfaces/db.interface';

const { host, port, database }: dbConfig = config.get('dbConfig');

export const dbConnection = {
  url: `mongodb://${host}:${port}/${database}`,
  options: {
    useNewUrlParser: true,
    useCreateIndex: true, // todo - without this crashing
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
