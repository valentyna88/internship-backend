import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';
import {
  CompanyRequest,
  RequestStatus,
  RequestType,
} from '../entities/company-request.entity';
import { Company } from '../entities/company.entity';
import { createPaginationObject } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class CompanyRequestService {
  constructor(
    @InjectRepository(CompanyRequest)
    private readonly requestRepository: Repository<CompanyRequest>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findRequestOrThrow(
    options: FindOneOptions<CompanyRequest>,
  ): Promise<CompanyRequest> {
    const request = await this.requestRepository.findOne(options);
    if (!request) {
      throw new NotFoundException('Request not found or access denied');
    }
    return request;
  }

  private async validateCompanyOwnership(
    companyId: string,
    ownerId: string,
  ): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Company not found');
    if (company.ownerId !== ownerId) {
      throw new ForbiddenException('Only the owner can perform this action');
    }
    return company;
  }

  private validatePending(request: CompanyRequest): void {
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Request is already processed');
    }
  }

  private async checkExistingInvitation(
    companyId: string,
    userId: string,
  ): Promise<void> {
    const existing = await this.requestRepository.findOne({
      where: {
        companyId,
        userId,
        type: RequestType.INVITATION,
        status: RequestStatus.PENDING,
      },
    });
    if (existing) {
      throw new BadRequestException(
        'An invitation is already pending for this user',
      );
    }
  }

  private async addMemberToCompany(
    companyId: string,
    userId: string,
  ): Promise<void> {
    await this.companyRepository
      .createQueryBuilder()
      .relation(Company, 'members')
      .of(companyId)
      .add(userId);
  }

  private async findPaginatedRequests(
    where: FindOptionsWhere<CompanyRequest>,
    relations: string[],
    pagination: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = pagination;

    const [items, total] = await this.requestRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations,
      order: { createdAt: 'DESC' },
    });

    return createPaginationObject(items, total, page, limit);
  }

  private async validateNotMember(
    companyId: string,
    userId: string,
  ): Promise<void> {
    const memberCompany = await this.companyRepository
      .createQueryBuilder('company')
      .innerJoin('company.members', 'member')
      .where('company.id = :companyId', { companyId })
      .andWhere('member.id = :userId', { userId })
      .getOne();

    if (memberCompany) {
      throw new BadRequestException('User is already a member of this company');
    }
  }

  async inviteUser(companyId: string, userId: string, ownerId: string) {
    await this.validateCompanyOwnership(companyId, ownerId);
    if (userId === ownerId)
      throw new BadRequestException('You cannot invite yourself');

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.validateNotMember(companyId, userId);

    await this.checkExistingInvitation(companyId, userId);

    const invitation = this.requestRepository.create({
      companyId,
      userId,
      type: RequestType.INVITATION,
      status: RequestStatus.PENDING,
    });
    return await this.requestRepository.save(invitation);
  }

  async cancelInvitation(requestId: string, ownerId: string) {
    const request = await this.findRequestOrThrow({
      where: {
        id: requestId,
        type: RequestType.INVITATION,
      },
      relations: ['company'],
    });

    if (request.company.ownerId !== ownerId) {
      throw new ForbiddenException('Only the owner can cancel invitation');
    }

    this.validatePending(request);

    await this.requestRepository.remove(request);
    return { message: 'Invitation cancelled successfully' };
  }

  async acceptInvitation(requestId: string, userId: string) {
    const request = await this.findRequestOrThrow({
      where: { id: requestId, userId, type: RequestType.INVITATION },
      relations: ['company'],
    });

    this.validatePending(request);

    request.status = RequestStatus.ACCEPTED;
    await this.requestRepository.save(request);
    await this.addMemberToCompany(request.companyId, userId);

    return request;
  }

  async declineInvitation(requestId: string, userId: string) {
    const request = await this.findRequestOrThrow({
      where: { id: requestId, userId, type: RequestType.INVITATION },
    });

    this.validatePending(request);

    request.status = RequestStatus.DECLINED;
    return await this.requestRepository.save(request);
  }

  async sendJoinRequest(companyId: string, userId: string) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) throw new NotFoundException('Company not found');
    if (company.ownerId === userId)
      throw new BadRequestException('You are the owner');

    await this.validateNotMember(companyId, userId);

    const existing = await this.requestRepository.findOne({
      where: {
        companyId,
        userId,
        status: RequestStatus.PENDING,
        type: RequestType.JOIN_REQUEST,
      },
    });
    if (existing)
      throw new BadRequestException('Request already sent and is pending');

    const joinRequest = this.requestRepository.create({
      companyId,
      userId,
      type: RequestType.JOIN_REQUEST,
      status: RequestStatus.PENDING,
    });
    return await this.requestRepository.save(joinRequest);
  }

  async cancelJoinRequest(requestId: string, userId: string) {
    const request = await this.findRequestOrThrow({
      where: { id: requestId, userId, type: RequestType.JOIN_REQUEST },
    });

    this.validatePending(request);
    await this.requestRepository.remove(request);

    return { message: 'Join request cancelled successfully' };
  }

  async acceptJoinRequest(requestId: string, ownerId: string) {
    const request = await this.findRequestOrThrow({
      where: { id: requestId, type: RequestType.JOIN_REQUEST },
      relations: ['company'],
    });

    if (request.company.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can accept join requests');
    }

    this.validatePending(request);

    request.status = RequestStatus.ACCEPTED;
    await this.requestRepository.save(request);
    await this.addMemberToCompany(request.companyId, request.userId);

    return request;
  }

  async declineJoinRequest(requestId: string, ownerId: string) {
    const request = await this.findRequestOrThrow({
      where: { id: requestId, type: RequestType.JOIN_REQUEST },
      relations: ['company'],
    });

    if (request.company.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can decline join requests');
    }

    this.validatePending(request);

    request.status = RequestStatus.DECLINED;
    return await this.requestRepository.save(request);
  }

  async getMyJoinRequests(userId: string, pagination: PaginationDto) {
    return this.findPaginatedRequests(
      { userId, type: RequestType.JOIN_REQUEST },
      ['company'],
      pagination,
    );
  }

  async getMyInvitations(userId: string, pagination: PaginationDto) {
    return this.findPaginatedRequests(
      { userId, type: RequestType.INVITATION },
      ['company'],
      pagination,
    );
  }

  async getCompanyInvitations(
    companyId: string,
    ownerId: string,
    pagination: PaginationDto,
  ) {
    await this.validateCompanyOwnership(companyId, ownerId);

    return this.findPaginatedRequests(
      { company: { id: companyId }, type: RequestType.INVITATION },
      ['user'],
      pagination,
    );
  }

  async getCompanyJoinRequests(
    companyId: string,
    ownerId: string,
    pagination: PaginationDto,
  ) {
    await this.validateCompanyOwnership(companyId, ownerId);
    return this.findPaginatedRequests(
      { company: { id: companyId }, type: RequestType.JOIN_REQUEST },
      ['user'],
      pagination,
    );
  }
}
