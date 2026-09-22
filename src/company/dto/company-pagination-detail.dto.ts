import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class CompanyPaginationDetailDto {
  @ApiProperty({ type: [Company] })
  items: Company[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
