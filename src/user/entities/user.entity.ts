import { ApiProperty } from '@nestjs/swagger';
import { hash, hashSync } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { lipsumParagraph } from 'src/utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@Index('UQ_USERNAME', ['username'], {
  unique: true,
  where: '(deleted_at IS NULL)',
})
@Index('UQ_EMAIL', ['email'], {
  unique: true,
  where: '(deleted_at IS NULL)',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Generated UUID', example: randomUUID() })
  id: string;

  @Column({ length: 50 })
  @ApiProperty({ example: 'janedoe67' })
  username: string;

  @Column({ length: 200 })
  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @Column({ length: 200 })
  @ApiProperty({ example: 'example@email.com' })
  email: string;

  @Column({ select: false })
  @ApiProperty({
    description: 'Hashed password',
    example: hashSync('Strong12!@', 10),
  })
  password: string;

  @Column({ length: 500, nullable: true })
  @ApiProperty({
    example: lipsumParagraph,
    nullable: true,
  })
  biography?: string;

  @OneToMany(() => Post, (post) => post.user)
  @ApiProperty({
    description: 'Posts made by the user',
    type: () => Post,
    isArray: true,
  })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @ApiProperty({
    description: 'Comments posted by the user',
    type: () => Comment,
    isArray: true,
  })
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({ example: new Date().toISOString(), nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await hash(this.password, 10);
    }
  }
}
