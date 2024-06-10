import { Injectable } from '@nestjs/common';
import type { FindOptionsWhere } from 'typeorm';

import { DefaultService } from '../../common/default/default.service';
import { UserDto } from './dtos/user.dto';
import type { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService extends DefaultService<UserEntity> {
  constructor(private readonly userRepository: UsersRepository) {
    super(userRepository);
  }

  async getOne(where: FindOptionsWhere<UserEntity>): Promise<UserDto> {
    const user = await this.userRepository.findOneOrException({
      where,
    });

    return new UserDto(user);
  }
}
