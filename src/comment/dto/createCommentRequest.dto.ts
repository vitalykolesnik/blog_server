import { ApiProperty } from '@nestjs/swagger';
import { CreateCommentDto } from '@app/comment/dto/createComment.dto';

export class CreateCommentRequestDto {
  @ApiProperty()
  readonly comment: CreateCommentDto;
}
