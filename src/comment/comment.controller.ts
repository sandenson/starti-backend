import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { BaseComment } from './types';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiCreatedResponse({
    description:
      'Creates new post and returns the record stored in the database',
    type: BaseComment,
  })
  create(@Body() dto: CreateCommentDto): Promise<Comment> {
    return this.commentService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({
    description:
      "Update is successful and the comment's new state in the database is returned",
    type: BaseComment,
  })
  @ApiNotFoundResponse({
    description: 'NotFoundException: Comment not found',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({
    description: 'NotFoundException: Post not found',
  })
  @ApiOkResponse({
    description:
      'Post successfully fully removed; its final state in the database is returned',
    type: BaseComment,
  })
  remove(@Param('id') id: string): Promise<Comment> {
    return this.commentService.remove(id);
  }
}
