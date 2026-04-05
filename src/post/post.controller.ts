import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post as PostRoute,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Comment } from 'src/comment/entities/comment.entity';
import { BaseComment } from 'src/comment/types';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { BasePost } from './types';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @PostRoute()
  @ApiCreatedResponse({
    description:
      'Creates new post and returns the record stored in the database',
    type: BasePost,
  })
  create(@Body() dto: CreatePostDto): Promise<Post> {
    return this.postService.create(dto);
  }

  @Get()
  @ApiOkResponse({
    description:
      "Returns every post stored in the database that's not soft-deleted",
    type: [BasePost],
  })
  async findAll(): Promise<Post[]> {
    return await this.postService.findAll();
  }

  @Get(':id')
  @ApiNotFoundResponse({
    description: 'NotFoundException: Post not found',
  })
  @ApiOkResponse({
    description: 'Returns the corresponding post',
    type: BasePost,
  })
  findOne(@Param('id') id: string): Promise<Post> {
    return this.postService.findOne(id);
  }

  @Get(':id/comments')
  @ApiNotFoundResponse({
    description: 'NotFoundException: Post not found',
  })
  @ApiOkResponse({
    description: "Returns all the post's comments",
    type: [BaseComment],
  })
  async findPostComments(@Param('id') id: string): Promise<Comment[]> {
    return await this.postService.findPostComments(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description:
      "Update is successful and the post's new state in the database is returned",
    type: BasePost,
  })
  @ApiNotFoundResponse({
    description: 'NotFoundException: Post not found',
  })
  update(@Param('id') id: string, @Body() dto: UpdatePostDto): Promise<Post> {
    return this.postService.update(id, dto);
  }

  @Patch(':id/archive')
  @ApiOkResponse({
    description:
      'Either the archival is successful or the post is already archived; either way its state in the database is returned',
    type: BasePost,
  })
  @ApiNotFoundResponse({
    description: 'NotFoundException: Post not found',
  })
  archive(@Param('id') id: string): Promise<Post> {
    return this.postService.archive(id);
  }

  @Delete(':id')
  @ApiNotFoundResponse({
    description: 'NotFoundException: Post not found',
  })
  @ApiOkResponse({
    description:
      'Post successfully fully removed; its final state in the database is returned',
    type: BasePost,
  })
  remove(@Param('id') id: string): Promise<Post> {
    return this.postService.remove(id);
  }
}
