import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { User } from 'src/user/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { createPaginationObject } from 'src/common/utils/pagination.util';

@Injectable()
export class CompanyMemberService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findCompanyOrThrow(companyId: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async leaveCompany(companyId: string, userId: string) {
    const company = await this.findCompanyOrThrow(companyId);

    if (company.ownerId === userId) {
      throw new BadRequestException(
        'Owner cannot leave the company. Transfer ownership first.',
      );
    }

    await this.companyRepository
      .createQueryBuilder()
      .relation(Company, 'members')
      .of(companyId)
      .remove(userId);

    return { message: 'Successfully left the company' };
  }

  async getCompanyMembers(companyId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;

    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.membersOf', 'company', 'company.id = :companyId', {
        companyId,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return createPaginationObject(users, total, page, limit);
  }

  async removeUserFromCompany(
    companyId: string,
    targetUserId: string,
    ownerId: string,
  ) {
    const company = await this.findCompanyOrThrow(companyId);

    if (company.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can remove members');
    }

    if (company.ownerId === targetUserId) {
      throw new BadRequestException('You cannot remove yourself as owner');
    }

    await this.companyRepository
      .createQueryBuilder()
      .relation(Company, 'members')
      .of(companyId)
      .remove(targetUserId);

    return { message: 'User removed successfully' };
  }
}
