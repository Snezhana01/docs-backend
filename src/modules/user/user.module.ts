import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../database/typeorm-ex.module';
import { UploadModule } from '../upload/upload.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    UploadModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
