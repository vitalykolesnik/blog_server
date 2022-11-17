import { ArticleEntity } from '@app/article/entity/article.entity';

export type ArticleType = Omit<ArticleEntity, 'updateTimestamp'>;
