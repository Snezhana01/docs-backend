import { ApiProperty } from '@nestjs/swagger';

import { DefaultDto } from '../../../common/default/default.dto';
import { RoleType } from '../../../constants';
import { UserEntity } from '../user.entity';

export class UserDto extends DefaultDto {
  @ApiProperty({ type: String })
  readonly login: string;

  @ApiProperty()
  readonly fullName: string | null;

  @ApiProperty({ type: Date })
  readonly birthDate: Date | null;

  @ApiProperty({ enum: RoleType, enumName: 'RoleType' })
  readonly role: RoleType;

  constructor(user: UserEntity) {
    super(user, { excludeFields: true });
    this.login = user.login;
    this.fullName = user.fullName;
    this.birthDate = user.birthDate;
    this.role = user.role;
  }
}
