import { DataSource } from 'typeorm';
import { dataSourceOptions } from '@app/ormconfig';

const dataSourceSeedOptions = {
  ...dataSourceOptions,
  migrations: [__dirname + '/seed/**/*{.js,.ts}'],
};

export const dataSource = new DataSource(dataSourceSeedOptions);
