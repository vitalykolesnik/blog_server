import { UserEntity } from '@app/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
