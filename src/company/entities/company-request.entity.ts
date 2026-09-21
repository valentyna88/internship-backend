import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from './company.entity';
import { User } from '../../user/user.entity';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export enum RequestType {
  INVITATION = 'invitation',
  JOIN_REQUEST = 'join_request',
}

@Entity('company_requests')
export class CompanyRequest extends BaseEntity {
  @Column()
  companyId: string;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: RequestType })
  type: RequestType;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
