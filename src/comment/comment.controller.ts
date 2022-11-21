import { DeleteResult } from 'typeorm';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@app/guards/auth.guard';
import { User } from '@app/decorators/user.decorator';
import { UserEntity } from '@app/user/entity/user.entity';
import { CreateCommentDto } from '@app/comment/dto/createComment.dto';
import { CommentService } from '@app/comment/comment.service';
import { CreateCommentRequestDto } from '@app/comment/dto/createCommentRequest.dto';
import { CommentResponseInterface } from '@app/comment/types/commentResponse.interface';

@ApiTags('comments')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('articles/:slug/comment')
  @ApiBody({ type: CreateCommentRequestDto })
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async addCommentToArcticle(
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.addCommentToArticle(
      currentUser,
      slug,
      createCommentDto,
    );
    return this.commentService.buildCommentResponse(comment);
  }

  @Delete('articles/:id/comment')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async deleteCommentOfArcticle(
    @User('id') currentUser: number,
    @Param('id') commentId: string,
  ): Promise<DeleteResult> {
    return await this.commentService.deleteCommentFromArticle(
      currentUser,
      commentId,
    );
  }
}
