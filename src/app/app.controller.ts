import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return {
      statusCode: 200
    };
  }

  @Get()
  getHello(@Query('name') name: string): string {
    return this.appService.getHello(name);
  }

}
