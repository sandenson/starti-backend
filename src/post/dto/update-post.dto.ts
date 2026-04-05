import { ToBoolean } from '@buka/class-transformer-extra';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['userId']),
) {
  @IsOptional()
  @ToBoolean(undefined, { optional: true })
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the post is archived or not',
    required: false,
    example: false,
  })
  archived?: boolean;
}
