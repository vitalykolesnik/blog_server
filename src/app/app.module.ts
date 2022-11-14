import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@app/ormconfig';
import { AuthMiddleware } from '@app/middleware/auth.middleware';
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from '@app/user/user.module';
import { ArticleModule } from '@app/article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TagModule,
    UserModule,
    ArticleModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
