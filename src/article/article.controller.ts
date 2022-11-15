import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@app/user/entity/user.entity';
import { ArticleService } from '@app/article/article.service';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { CreateArticleRequestDto } from '@app/article/dto/createArticleRequest.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';
import { AuthGuard } from '@app/guards/auth.guard';
import { User } from '@app/decorators/user.decorator';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiBody({ type: CreateArticleRequestDto })
  @UseGuards(AuthGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiBearerAuth('access-token')
  async createArticle(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Get()
  async findAllArticles(): Promise<ArticlesResponseInterface> {
    const article = await this.articleService.findAllArticles();
    return this.articleService.buildArticlesResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    await this.articleService.deleteArticle(currentUserId, slug);
    return '' as any;
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateArticleRequestDto })
  @ApiBearerAuth('access-token')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') articleUpdateDto: CreateArticleDto,
  ) {
    const article = await this.articleService.updateArticle(
      currentUserId,
      slug,
      articleUpdateDto,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
