import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Company } from '../company/entities/company.entity';

@Entity('users')
export class User extends BaseEntity {
  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];

  @ManyToMany(() => Company, (company) => company.members)
  @JoinTable({ name: 'company_members' })
  membersOf: Company[];

  @Column({ nullable: true })
  name?: string;

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  @Exclude({ toPlainOnly: true })
  passwordHash: string;
}
