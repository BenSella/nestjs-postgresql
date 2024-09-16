import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('error')
  throwError() {
    throw new Error('This is a test error to check Elasticsearch logging.');
  }
}
