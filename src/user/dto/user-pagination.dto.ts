import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class UserPaginationDetailDto {
  @ApiProperty({ type: [User] })
  items: User[];

  @ApiProperty({ type: PaginationMetaDto })
  pagination: PaginationMetaDto;
}
