import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const createDocumentation = (path: string, app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Blog_NestJS')
    .setDescription('The Blog_NestJS API description')
    .setVersion('0.0.1')
    .addTag('users')
    .addTag('tags')
    .addTag('articles')
    .addTag('profiles')
    .addTag('comments')
    .addBearerAuth(
      {
        description:
          'JWT Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJqZXJyeSIsImVtYWlsIjoiamVycnlAZ21haWwuY29tIiwiaWF0IjoxNjY5MDMyMTMyfQ.2HuEn3dIDY8hd3UlU_SbDIOOFXQZ4jisqfefB9AXj8U',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
};
