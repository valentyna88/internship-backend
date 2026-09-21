import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { CompanyRequestDetailDto } from './company-request-detail.dto';

export class CompanyRequestResponseDto extends ApiResponseDto<CompanyRequestDetailDto> {
  @ApiProperty({ type: CompanyRequestDetailDto })
  declare detail: CompanyRequestDetailDto;

  @ApiProperty({ example: 200 })
  declare status_code: number;
}

export class CompanyRequestCreatedResponseDto extends CompanyRequestResponseDto {
  @ApiProperty({ example: 201 })
  declare status_code: number;
}
