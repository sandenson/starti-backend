import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}
  create(dto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(dto);
    return this.postsRepository.save(post);
  }

  async findAll(withDeleted: boolean = false): Promise<Post[]> {
    const posts = await this.postsRepository.find({ withDeleted });
    return posts;
  }

  async findOne(id: string, withDeleted: boolean = false): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({
        where: { id },
        withDeleted,
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (e: any) {
      if (e.name == 'QueryFailedError' && /uuid/im.test(e.message)) {
        throw new BadRequestException("ID isn't a valid UUID");
      }

      throw e;
    }
  }

  async findPostComments(
    postId: string,
    withDeleted: boolean = false,
  ): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({
      where: { postId },
      withDeleted,
    });

    return comments;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    const updated = this.postsRepository.merge(post, dto);
    return this.postsRepository.save(updated);
  }

  async archive(id: string): Promise<Post> {
    const post = await this.findOne(id);

    if (!post.archived) {
      const updated = this.postsRepository.merge(post, { archived: true });
      return this.postsRepository.save(updated);
    }

    return post;
  }

  async remove(id: string): Promise<Post> {
    const post = await this.findOne(id);
    return this.postsRepository.softRemove(post);
  }
}
