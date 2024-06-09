import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcryptjs';

import { UserDto } from '../user/dtos/user.dto';
import type { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import type { AuthorizationDto } from './dtos/req/authorization.dto';
import type { RegistrationDto } from './dtos/req/registration.dto';
import type { TokenResponseDto } from './dtos/res/token-response.dto';
import { UserAuthResponseDto } from './dtos/res/user-auth-response.dto';
import type { IAuthPayload } from './interfaces/iauth-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(payload: AuthorizationDto): Promise<UserAuthResponseDto> {
    const userEntity = await this.validateModerators(payload);

    const token = this.generateToken(userEntity);

    return new UserAuthResponseDto(new UserDto(userEntity), token);
  }

  async registration(payload: RegistrationDto): Promise<UserAuthResponseDto> {
    const { login, password } = payload;
    const isExist = await this.userRepository.exist({ where: { login } });

    if (isExist) {
      throw new ConflictException(
        'Пользователь с таким логином уже существует',
      );
    }

    const newUser = this.userRepository.create({
      login,
      password: hashSync(password, 5),
    });

    const userEntity = await this.userRepository.save(newUser);

    const token = this.generateToken(userEntity);

    return new UserAuthResponseDto(new UserDto(userEntity), token);
  }

  async validateModerators(payload: AuthorizationDto): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({
      where: { login: payload.login },
    });

    if (!userEntity) {
      throw new NotFoundException('user.notFoundByEmail');
    }

    if (!userEntity.password) {
      throw new BadRequestException('user.notHavePassword');
    }

    const isPasswordEquals = await compare(
      String(payload.password),
      userEntity.password,
    );

    if (!isPasswordEquals) {
      throw new BadRequestException('auth.incorrectEmailOrPassword');
    }

    return userEntity;
  }

  getUserFromAuthenticationToken(token: string) {
    return this.jwtService.verify(token);
  }

  private generateToken(user: UserEntity): TokenResponseDto {
    const payload: IAuthPayload = {
      id: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
