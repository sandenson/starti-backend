import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Generated UUID', example: randomUUID() })
  id: string;

  @Column({ name: 'user_id', nullable: true })
  @ApiProperty({
    description: 'UUID of the user who created the post',
    example: randomUUID(),
  })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'User who created the post',
    type: User,
  })
  user?: User | null;

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: ['soft-remove', 'recover'],
  })
  @ApiProperty({
    description: 'Comments made in the post',
    type: () => Comment,
    isArray: true,
  })
  comments: Comment[];

  @Column({ length: 10000 })
  @ApiProperty({
    description: 'Text of the post; limit of 10000 characters',
  })
  text: string;

  @Column({ default: false })
  @ApiProperty({
    description: "Archived posts can't get new comments",
    default: false,
  })
  archived: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({ example: new Date().toISOString(), nullable: true })
  deletedAt?: Date;
}
