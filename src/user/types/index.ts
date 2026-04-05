import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class BaseUser extends OmitType(User, ['posts']) {}
