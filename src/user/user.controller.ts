import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Post as PostEntity } from 'src/post/entities/post.entity';
import { BasePost } from 'src/post/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BaseUser } from './types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBadRequestResponse({
    description:
      "Request body didn't pass schema validation or doesn't respect database constraints",
    examples: {
      userExists: {
        summary: 'BadRequestException: User already exists',
        value: 'Email already in use',
      },
    },
  })
  @ApiCreatedResponse({
    description:
      'Creates new user and returns the record stored in the database',
    type: BaseUser,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    description:
      "Returns every user stored in the database that's not soft-deleted",
    type: [BaseUser],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiNotFoundResponse({
    description: 'NotFoundException: User not found',
  })
  @ApiOkResponse({
    description: 'Returns the corresponding user',
    type: BaseUser,
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get(':id/public-posts')
  @ApiNotFoundResponse({
    description: 'NotFoundException: User not found',
  })
  @ApiOkResponse({
    description: "Returns the user's posts that are not archived",
    type: [BasePost],
  })
  async findPublicPosts(@Param('id') id: string): Promise<PostEntity[]> {
    return await this.userService.findPublicPosts(id);
  }

  @Patch(':id')
  @ApiNotFoundResponse({
    description: 'NotFoundException: User not found',
  })
  @ApiBadRequestResponse({
    description: 'BadRequestException',
    examples: {
      emailInUse: {
        summary: 'BadRequestException: Email already in use',
        value: 'Email already in use',
      },
      usernameInUse: {
        summary: 'BadRequestException: Username already in use',
        value: 'Username already in use',
      },
    },
  })
  @ApiOkResponse({
    description:
      "Update is successful and the user's new state in the database is returned",
    type: BaseUser,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({
    description: 'NotFoundException: User not found',
    type: BaseUser,
  })
  @ApiOkResponse({
    description:
      'User successfully soft removed; its current state in the database is returned',
  })
  softRemove(@Param('id') id: string) {
    return this.userService.softRemove(id);
  }

  @Delete(':id/forgetme')
  @ApiNotFoundResponse({
    description: 'NotFoundException: User not found',
  })
  @ApiOkResponse({
    description:
      'User successfully fully removed; its final state in the database is returned',
    type: BaseUser,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
