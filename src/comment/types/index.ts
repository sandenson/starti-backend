import { OmitType } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';

export class BaseComment extends OmitType(Comment, ['user', 'post']) {}
export class PostfulComment extends OmitType(Comment, ['user']) {}
