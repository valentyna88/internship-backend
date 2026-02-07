import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserSingleDetailDto {
  @ApiProperty({ type: User })
  user: User;
}
