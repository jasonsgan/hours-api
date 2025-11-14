import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);
  
  getHello(name: string): string {
    this.logger.log('getHello called');
    if (name === 'dumbledore') {
      throw new Error('He disappeared');
    }
    if (name === 'voldemort') {
      throw new BadRequestException('He must not be named');
    }
    if (name) {
      return `Hello ${name}!`;
    }
    return 'Hello World!';
  }
}
