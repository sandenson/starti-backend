import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  create(dto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(dto);
    return this.commentsRepository.save(comment);
  }

  findAll(withDeleted: boolean = false): Promise<Comment[]> {
    const comments = this.commentsRepository.find({ withDeleted });
    return comments;
  }

  async findOne(id: string, withDeleted: boolean = false): Promise<Comment> {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { id },
        withDeleted,
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      return comment;
    } catch (e: any) {
      if (e.name == 'QueryFailedError' && /uuid/im.test(e.message)) {
        throw new BadRequestException("ID isn't a valid UUID");
      }

      throw e;
    }
  }

  async update(id: string, dto: UpdateCommentDto) {
    const comment = await this.findOne(id);
    const updated = this.commentsRepository.merge(comment, dto);
    return this.commentsRepository.save(updated);
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    return this.commentsRepository.softRemove(comment);
  }
}
