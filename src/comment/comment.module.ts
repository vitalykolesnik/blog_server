import { ArticleEntity } from '@app/article/entity/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentController } from '@app/comment/comment.controller';
import { CommentService } from '@app/comment/comment.service';
import { CommentEntity } from '@app/comment/entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, ArticleEntity])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
