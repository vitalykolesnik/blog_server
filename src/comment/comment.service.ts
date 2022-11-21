import { DeleteResult, Repository } from 'typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entity/user.entity';
import { CommentResponseInterface } from '@app/comment/types/commentResponse.interface';
import { CreateCommentDto } from '@app/comment/dto/createComment.dto';
import { CommentEntity } from '@app/comment/entity/comment.entity';
import { ArticleEntity } from '@app/article/entity/article.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async addCommentToArticle(
    currentUser: UserEntity,
    slug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const comment = new CommentEntity();
    Object.assign(comment, createCommentDto);
    comment.article = article;
    comment.author = currentUser;
    return await this.commentRepository.save(comment);
  }

  async deleteCommentFromArticle(
    currentUserId: number,
    commentId: string,
  ): Promise<DeleteResult> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['article'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.article.author.id !== currentUserId) {
      throw new ForbiddenException('Forbidden');
    }

    return await this.commentRepository.delete(comment.id);
  }

  buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
    return { comment };
  }
}
