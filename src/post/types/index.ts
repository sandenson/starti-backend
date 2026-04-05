import { OmitType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class BasePost extends OmitType(Post, ['user']) {}
