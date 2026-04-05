import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => Post, (post) => post.comments, {})
  @JoinColumn({ name: 'post_id' })
  @ApiProperty({
    description: 'Post in which the comment was made',
    type: Post,
  })
  post: Post;

  @Column({ name: 'user_id' })
  userId: string | null;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'User who posted the comment',
    type: User,
  })
  user?: User | null;

  @Column({ length: 5000 })
  @ApiProperty({
    description: 'Text of the comment; limit of 5000 characters',
  })
  message: string;

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
