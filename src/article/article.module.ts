import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { UserEntity } from '@app/user/entity/user.entity';
import { FollowEntity } from '@app/profile/entity/follow.entity';
import { CommentEntity } from '@app/comment/entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      UserEntity,
      FollowEntity,
      CommentEntity,
    ]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
