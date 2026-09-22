import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { createPaginationObject } from 'src/common/utils/pagination.util';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto, ownerId: string) {
    const company = this.companyRepository.create({
      ...dto,
      ownerId,
    });
    return await this.companyRepository.save(company);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [items, total] = await this.companyRepository.findAndCount({
      where: { isVisible: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return createPaginationObject(items, total, page, limit);
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto, ownerId: string) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    if (company.ownerId !== ownerId) {
      throw new ForbiddenException('You are not the owner of this company');
    }
    Object.assign(company, dto);
    return await this.companyRepository.save(company);
  }

  async remove(id: string, ownerId: string) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    if (company.ownerId !== ownerId) {
      throw new ForbiddenException('You are not the owner of this company');
    }

    await this.companyRepository.remove(company);
    return { message: 'Company deleted successfully' };
  }
}
