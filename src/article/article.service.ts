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
import { dataSource } from '@app/ormconfig';
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
      .leftJoinAndSelect('articles.author', 'author'); // left join -> add author to articles table

    if (query.favorited) {
      // find articles which 'user.username = query.favorited' liked
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((el) => el.id); // get id of articles from 'user.favorites'

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN(:...ids)', { ids }); // find articles with id = ids
      } else {
        queryBuilder.andWhere('1=0'); // if ids not found
      }
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      console.log('author: ', author);
      const ids = author.favorites.map((el) => el.id);

      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN(:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        // find articles where 'articles.tagList contain query.tag'
        tag: `%${query.tag}%`,
      });
    }

    if (query.author) {
      // find 'articles' by 'author'
      const author = await this.userRepository.findOneBy({
        username: query.author,
      });

      if (!author) {
        throw new NotFoundException('Author not found');
      }
      queryBuilder.andWhere('articles.authorId = :id', { id: author.id }); // find articles by 'author.id'
    }

    queryBuilder.orderBy('articles.createdAt', 'ASC');
    queryBuilder.limit(query.limit || 10);
    queryBuilder.offset(query.offset || 0);

    let favoriteIds: number[] = []; // create 'favoriteIds', than show 'id' of 'favorited' article

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((favorite) => favorite.id); // set 'favoriteIds' from 'favorites' table
    }

    const articles = await queryBuilder.getMany(); // return articles
    const articlesCount = await queryBuilder.getCount(); // return articles count
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id); // add every 'article' field 'favorited'
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
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
  ): Promise<ArticleEntity> {
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

  async addArticleToFavorite(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async removeArticleFromFavorite(
    currentUserId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
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
