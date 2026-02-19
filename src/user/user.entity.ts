import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  passwordHash: string;
}
