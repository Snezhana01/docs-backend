import { DefaultRepository } from '../../common/default/default.repository';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { UserEntity } from './user.entity';

@CustomRepository(UserEntity)
export class UsersRepository extends DefaultRepository<UserEntity> {}
