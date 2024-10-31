import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Get()
  getHello(): string {
    return this.userServiceService.getHello();
  }

  @EventPattern('test-connection-user-event-pattern')
  async testConnection(@Payload() data: any) {
    console.log('Received Data From RMQ', data);
  }

  @MessagePattern({ cmd: 'test-connection-user-message-pattern' })
  async testConnectionMessagePattern(@Payload() data: any) {
    console.log('Received Data From RMQ', data);
    return {
      message: 'hai this is from user service',
    };
  }
}
