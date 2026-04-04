import {
  Replace,
  ToLowerCase,
  ToString,
  Trim,
} from '@buka/class-transformer-extra';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

const passwordMessage =
  'Password must be at least 8 characters long, at most 50 characters long, and contain at least 1 lowercase letter, 1 uppercase letter, 2 numbers and 2 symbols';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name must be at most 50 characters long',
    example: 'janedoe67',
  })
  @ToString({ optional: true })
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Replace(/\s/g, '')
  @ToLowerCase()
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'Name must be at most 200 characters long',
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description:
      'Email must be an email address and at most 200 characters long',
    example: 'example@email.com',
  })
  @Trim()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @ApiProperty({ description: passwordMessage, example: 'Strong12!@' })
  @Trim()
  @IsStrongPassword(
    { minSymbols: 2, minNumbers: 2 },
    {
      message: passwordMessage,
    },
  )
  password: string;

  @ApiProperty({
    description:
      'Biography is optional, but must be at most 500 characters long',
    required: false,
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt sed turpis ac commodo. Aenean iaculis vehicula risus, nec interdum felis fringilla ut. Aliquam ultricies nisl ut nisl efficitur auctor. In viverra sit amet orci et aliquam. Integer dapibus nec sem vitae maximus. Integer consequat mi ipsum, eu sollicitudin neque ultrices id. Nunc vestibulum euismod congue. Morbi ipsum ipsum, ultricies at justo ut, pharetra aliquet eros.',
  })
  @IsString()
  @MaxLength(500)
  biography?: string;
}
