import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { UserEntity } from '@app/user/entity/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });
    if (!article) {
      throw new UnprocessableEntityException('Article does not found');
    }
    return article;
  }

  async findAllArticles(): Promise<ArticleEntity[]> {
    return await this.articleRepository.find();
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new NotFoundException('Article does not exist');
    }
    if (article.author.id !== currentUserId) {
      throw new ForbiddenException('You are not author');
    }
    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    currentUserId: number,
    slug: string,
    updateArticleDto: CreateArticleDto,
  ) {
    const sourceArticle = await this.findBySlug(slug);
    if (!sourceArticle) {
      throw new NotFoundException('Article does not exist');
    }
    if (sourceArticle.author.id !== currentUserId) {
      throw new ForbiddenException('You are not author');
    }
    Object.assign(sourceArticle, updateArticleDto);
    return await this.articleRepository.save(sourceArticle);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  buildArticlesResponse(articles: ArticleEntity[]): ArticlesResponseInterface {
    return { articles };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, {
        replacement: '-',
        lower: true,
        strict: true,
        trim: true,
      }) +
      '-' +
      v4()
    );
  }
}
