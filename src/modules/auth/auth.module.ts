import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { CodeGeneratorService } from '../../shared/services/code-generator.service';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.jwtSecret || 'SECRET',
        signOptions: {
          expiresIn: configService.authConfig.jwtExpiresIn || '24h',
        },
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmExModule.forCustomRepository([UsersRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CodeGeneratorService],
  exports: [AuthService],
})
export class AuthModule {}
