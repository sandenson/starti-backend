import { OmitType } from '@nestjs/swagger';
import { Post } from '../entities/post.entity';

export const UserlessPost = OmitType(Post, ['user']);
