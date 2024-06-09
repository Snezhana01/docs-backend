import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

import { SnakeNamingStrategy } from '../../database/snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get useTestCode(): boolean {
    return this.getBoolean('NEED_TESTING_CODE');
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get serverUrl(): string {
    return this.getString('SERVER_URL');
  }



  get S3Config() {
    return {
      accessKeyId: this.getString('S3_ACCESS_KEY'),
      secretAccessKey: this.getString('S3_SECRET_KEY'),
      bucketName: this.getString('S3_BUCKET_NAME'),
      region: this.getString('S3_REGION'),
      endpoint: this.getString('S3_ENDPOINT'),
    };
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [__dirname + '/../../modules/**/*.entity.{ts,js}'];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get authConfig() {
    return {
      jwtSecret: this.getString('JWT_SECRET'),
      jwtExpiresIn: this.getString('JWT_EXPIRES_IN'),
    };
  }

  get uploadConfig() {
    return {
      uploadDirectory: this.getString('UPLOAD_DIRECTORY'),
      fileNameLength: this.getNumber('UPLOAD_FILE_NAME_LENGTH'),
      fileNameCharacters: this.getString('UPLOAD_FILE_NAME_CHARACTERS'),
      maxFileSize: this.getNumber('UPLOAD_MAX_FILE_SIZE'),
      maxFilesToUpload: this.getNumber('UPLOAD_MAX_FILES_TO_UPLOAD'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }
}
