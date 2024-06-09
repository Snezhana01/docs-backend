import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthorizationDto } from './dtos/req/authorization.dto';
import { RegistrationDto } from './dtos/req/registration.dto';
import { UserAuthResponseDto } from './dtos/res/user-auth-response.dto';

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Авторизация',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    type: UserAuthResponseDto,
  })
  login(@Body() payload: AuthorizationDto): Promise<UserAuthResponseDto> {
    return this.authService.login(payload);
  }

  @Post('registration')
  @ApiOperation({
    summary: 'Регистрация',
  })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    type: UserAuthResponseDto,
  })
  registration(@Body() payload: RegistrationDto): Promise<UserAuthResponseDto> {
    return this.authService.registration(payload);
  }
}
