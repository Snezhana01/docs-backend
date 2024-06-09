import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOkResponse({ type: UserDto })
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.REDACTOR], 'Получить свои данные')
  getMe(@AuthUser() user: UserEntity) {
    return this.userService.getOne({ id: user.id });
  }
}
