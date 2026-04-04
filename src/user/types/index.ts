import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class PostslessUser extends OmitType(User, ['posts']) {}
