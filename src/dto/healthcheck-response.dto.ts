import { ApiProperty } from '@nestjs/swagger';

export class HealthcheckResponseDto {
  @ApiProperty({ example: 200 })
  status_code: number;

  @ApiProperty({ example: 'ok' })
  detail: string;

  @ApiProperty({ example: 'working' })
  result: string;
}
