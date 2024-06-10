import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import compression from 'compression';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { setupSwagger } from './documentation/setup-swagger';
import { AppModule } from './modules/app/app.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(morgan('combined'));
  app.use(compression());
  app.enableVersioning();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // const adapter = new WebsocketAdapter(app, app.get(AuthService));
  // app.useWebSocketAdapter(adapter);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);
  logger.debug(configService.nodeEnv);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (configService.documentationEnabled) {
    const apiUrl = `${configService.serverUrl}`;
    setupSwagger(app, apiUrl);
  }

  await app.listen(configService.appConfig.port);
  logger.debug(`Server running on ${await app.getUrl()}`);
}

void bootstrap();
