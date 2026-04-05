import { ToString, Trim } from '@buka/class-transformer-extra';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { randomUUID } from 'crypto';
import { lipsumParagraph } from 'src/utils';

export class CreateCommentDto {
  @Trim()
  @IsUUID()
  @ApiProperty({
    description: 'UUID of the user who posted the comment',
    example: randomUUID(),
  })
  userId: string;

  @Trim()
  @IsUUID()
  @ApiProperty({
    description: 'UUID of the post the comment was made in',
    example: randomUUID(),
  })
  postId: string;

  @ToString({ optional: true })
  @IsString()
  @Trim()
  @IsNotEmpty()
  @MaxLength(5000)
  @ApiProperty({
    description: 'Text content of the comment',
    example: lipsumParagraph,
  })
  message: string;
}
