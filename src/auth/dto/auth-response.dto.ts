import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

export class LoginResultDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
  access_token: string;

  @ApiProperty({ example: 'hfdk5g4f5nfddf55h...' })
  refresh_token: string;
}

export class LoginResponseDto extends ApiResponseDto<LoginResultDto> {
  @ApiProperty({ type: LoginResultDto })
  declare detail: LoginResultDto;
}
