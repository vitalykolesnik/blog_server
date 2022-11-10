import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const createDocumentation = (path: string, app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Blog_NestJS')
    .setDescription('The Blog_NestJS API description')
    .setVersion('0.0.1')
    .addTag('users')
    .addTag('tags')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
};
