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
    .addBearerAuth(
      {
        description:
          'JWT Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInVzZXJuYW1lIjoiamVycnkiLCJlbWFpbCI6ImplcnJ5QGdtYWlsLmNvbSIsImlhdCI6MTY2ODYwMTk5OX0.841aonX68RhS62a4Nm8GRy3xBxjsrw2f0jIZBLc2zkQ',
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
