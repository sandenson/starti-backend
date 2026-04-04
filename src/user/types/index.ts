import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export const PostslessUser = OmitType(User, ['posts']);
