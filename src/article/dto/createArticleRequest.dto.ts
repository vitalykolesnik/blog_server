import { ApiProperty } from '@nestjs/swagger';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';

export class CreateArticleRequestDto {
  @ApiProperty()
  readonly article: CreateArticleDto;
}
