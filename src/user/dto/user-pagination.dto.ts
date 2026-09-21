import { ApiProperty } from '@nestjs/swagger';
import { UserPublicDto } from './user-public.dto';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

export class UserPaginationDetailDto {
  @ApiProperty({ type: [UserPublicDto] })
  items: UserPublicDto[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
