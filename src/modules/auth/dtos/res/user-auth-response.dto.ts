import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../../user/dtos/user.dto';
import { TokenResponseDto } from './token-response.dto';

export class UserAuthResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokenResponseDto })
  token: TokenResponseDto;

  constructor(user: UserDto, token: TokenResponseDto) {
    this.user = user;
    this.token = token;
  }
}
