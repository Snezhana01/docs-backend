/* eslint-disable @moneteam/nestjs/controllers-should-supply-api-tags */
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  @ApiOkResponse()
  @Get()
  getHello() {
    return 'api is ready';
  }
}
