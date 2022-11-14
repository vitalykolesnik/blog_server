import { Module } from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { ArticleController } from '@app/article/article.controller';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
