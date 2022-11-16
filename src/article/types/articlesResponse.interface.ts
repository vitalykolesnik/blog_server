import { ArticleEntity } from '@app/article/entity/article.entity';

export interface ArticlesResponseInterface {
  articles: ArticleEntity[];
  articlesCount: number;
}
