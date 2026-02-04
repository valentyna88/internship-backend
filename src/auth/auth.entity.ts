import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('auth')
export class Auth extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  refreshTokenHash: string;
}
