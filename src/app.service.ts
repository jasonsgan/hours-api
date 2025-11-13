import { HttpException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);
  
  getHello(name: string): string {
    this.logger.log('getHello called');
    if (name === 'voldemort') {
      throw new HttpException('He must not be named', 400);
    } else if (name) {
      return `Hello ${name}!`;
    }
    return 'Hello World!';
  }
}
