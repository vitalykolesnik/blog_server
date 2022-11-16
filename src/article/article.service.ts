import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { UserEntity } from '@app/user/entity/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';
import { dataSource } from '@app/ormconfig';
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOneBy({
        username: query.author,
      });
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      queryBuilder.andWhere('articles.authorId = :id', { id: author.id });
    }

    queryBuilder.orderBy('articles.createdAt', 'ASC');
    queryBuilder.limit(query.limit || 10);
    queryBuilder.offset(query.offset || 0);

    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    return { articles, articlesCount };
  }

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
