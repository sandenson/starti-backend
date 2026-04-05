import { ToString, Trim } from '@buka/class-transformer-extra';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { randomUUID } from 'crypto';
import { lipsumParagraph } from 'src/utils';

export class CreatePostDto {
  @Trim()
  @IsUUID()
  @ApiProperty({
    description: 'UUID of the user who created the post',
    example: randomUUID(),
  })
  userId: string;

  @ToString({ optional: true })
  @IsString()
  @Trim()
  @IsNotEmpty()
  @MaxLength(10000)
  @ApiProperty({
    description: 'Text content of the post',
    example: lipsumParagraph,
  })
  text: string;
}
