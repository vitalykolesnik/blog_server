import { Controller, Post } from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async createArticle(): Promise<any> {
    return this.articleService.createArcticle();
  }
}
