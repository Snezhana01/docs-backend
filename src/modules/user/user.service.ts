import { Injectable } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';

import { DefaultService } from '../../common/default/default.service';
import { UserDto } from './dtos/user.dto';
import type { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends DefaultService<UserEntity> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async getOne(where: FindOptionsWhere<UserEntity>): Promise<UserDto> {
    const user = await this.userRepository.findOneOrException({
      where,
    });

    return new UserDto(user);
  }
}
