import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 200 })
  status_code: number;

  @ApiProperty({ example: 'working' })
  result: string;

  @ApiProperty()
  detail: T;

  constructor(detail: T, statusCode = 200, result = 'working') {
    this.status_code = statusCode;
    this.detail = detail;
    this.result = result;
  }
}
