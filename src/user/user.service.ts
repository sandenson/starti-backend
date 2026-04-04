import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { email, username, ...userData } = dto;
    const foundUser = await this.usersRepository.findOneBy([
      { email },
      { username },
    ]);

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.usersRepository.create({
      email,
      username,
      ...userData,
    });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async findOne(id: string, withDeleted: boolean = false): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        withDeleted,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (e: any) {
      if (e.name == 'QueryFailedError' && /uuid/im.test(e.message)) {
        throw new BadRequestException("ID isn't a valid UUID");
      }

      throw e;
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const { email, username } = dto;

    const user = await this.findOne(id);

    if (email || username) {
      const exists = await this.usersRepository.findOneBy([
        email && { id: Not(id), email },
        username && { id: Not(id), username },
      ]);

      if (email && exists?.email === email) {
        throw new BadRequestException('Email already in use');
      } else if (username && exists?.username === username) {
        throw new BadRequestException('Username already in use');
      }
    }

    const updated = this.usersRepository.merge(user, dto);
    return this.usersRepository.save(updated);
  }

  async softRemove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return this.usersRepository.softRemove(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
