import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserRepository } from '../user/user.repository';
import type { IAuthPayload } from './interfaces/iauth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.authConfig.jwtSecret || 'SECRET',
    });
  }

  async validate(payload: IAuthPayload) {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.id,
        role: payload.role,
      },
    });

    if (!user) {
      throw new UnauthorizedException('auth.unauthorized');
    }

    return user;
  }
}
