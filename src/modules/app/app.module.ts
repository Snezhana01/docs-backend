import { BooksModule } from '@modules/books/books.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getEnvPath } from '../../common/helpers/get-env-path.helper';
import { GenerateUrlForUploadsInterceptor } from '../../interceptors/generate-url-for-uploads.interceptor';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getEnvPath()],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    SharedModule,
    AuthModule,
    UsersModule,
    UploadModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GenerateUrlForUploadsInterceptor,
    },
  ],
})
export class AppModule {}
