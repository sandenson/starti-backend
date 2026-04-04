import { ApiProperty } from '@nestjs/swagger';
import { hash, hashSync } from 'bcrypt';
import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tincidunt sed turpis ac commodo. Aenean iaculis vehicula risus, nec interdum felis fringilla ut. Aliquam ultricies nisl ut nisl efficitur auctor. In viverra sit amet orci et aliquam. Integer dapibus nec sem vitae maximus. Integer consequat mi ipsum, eu sollicitudin neque ultrices id. Nunc vestibulum euismod congue. Morbi ipsum ipsum, ultricies at justo ut, pharetra aliquet eros.',
    nullable: true,
  })
  biography?: string;

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
