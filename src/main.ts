if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { dataSource } from '@app/ormconfig';
import { AppModule } from '@app/app/app.module';
import { createDocumentation } from '@app/api/api.utils';

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);
  createDocumentation('api', app);

  try {
    await dataSource.initialize();
    await app.listen(port);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
