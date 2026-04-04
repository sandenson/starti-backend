import { OmitType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export class UserlessPost extends OmitType(Post, ['user']) {}
