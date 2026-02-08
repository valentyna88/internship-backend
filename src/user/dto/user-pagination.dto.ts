import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 0 })
  offset: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;

  @ApiProperty({ example: false })
  hasPrev: boolean;
}

export class UserPaginationDetailDto {
  @ApiProperty({ type: [User] })
  items: User[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
