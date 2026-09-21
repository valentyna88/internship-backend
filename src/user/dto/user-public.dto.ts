import { ApiProperty } from '@nestjs/swagger';

export class UserPublicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
