import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
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
