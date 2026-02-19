import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (at least 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
