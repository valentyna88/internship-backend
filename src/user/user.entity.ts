import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Company } from '../company/entities/company.entity';

@Entity('users')
export class User extends BaseEntity {
  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  passwordHash: string;
}
