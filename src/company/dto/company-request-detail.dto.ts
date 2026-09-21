import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus, RequestType } from '../entities/company-request.entity';

export class CompanyRequestDetailDto {
  @ApiProperty({ example: '160a819c-2c55-4dde-8259-b9e0f2bc08e4' })
  id: string;

  @ApiProperty({ example: '2026-02-26T11:02:15.423Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-26T11:02:15.423Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'eeaaf7b2-8fd6-4003-8dc4-5624bb5bd146' })
  companyId: string;

  @ApiProperty({ example: '5a78d892-73ad-4eb0-baf2-ce3cffafa810' })
  userId: string;

  @ApiProperty({ enum: RequestType, example: RequestType.INVITATION })
  type: RequestType;

  @ApiProperty({ enum: RequestStatus, example: RequestStatus.PENDING })
  status: RequestStatus;
}
