import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { UserPaginationDetailDto } from 'src/user/dto/user-pagination.dto';

export class UserPaginationResponseDto extends ApiResponseDto<UserPaginationDetailDto> {
  @ApiProperty({ type: UserPaginationDetailDto })
  declare detail: UserPaginationDetailDto;
}
