import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('test-connection-user')
  async testConnectionUser(data: Record<string, unknown>) {
    console.log('Received Data From RMQ', data);
  }
}
