import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class CompanyPaginationDetailDto {
  @ApiProperty({ type: [Company] })
  items: Company[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}

import { CompanyRequest } from '../entities/company-request.entity';

export class CompanyRequestPaginationDto {
  @ApiProperty({ type: [CompanyRequest] })
  items: CompanyRequest[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
