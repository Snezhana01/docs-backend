import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { CodeGeneratorService } from './services/code-generator.service';
import { EventEmitterService } from './services/event-emitter.service';

@Global()
@Module({
  providers: [ApiConfigService, CodeGeneratorService, EventEmitterService],
  exports: [ApiConfigService, CodeGeneratorService, EventEmitterService],
})
export class SharedModule {}
