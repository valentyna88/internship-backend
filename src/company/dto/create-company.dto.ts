import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'My Company' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Description of the company', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
