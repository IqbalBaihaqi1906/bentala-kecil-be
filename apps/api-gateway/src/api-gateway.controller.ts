import { Controller, Get, Inject } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from "rxjs";

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    @Inject('USER_SERVICE') private rmqClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Get('test-connection-user-event-pattern')
  async testConnectionUser() {
    this.rmqClient.emit('test-connection-user', {
      message: 'hai this is from api gateway',
    });

    return {
      status: 'success to connect to user service',
    };
  }

  @Get('test-connection-user-message-pattern')
  async testConnectionUserMessagePattern() {
    const response = await firstValueFrom(
      this.rmqClient.send(
        { cmd: 'test-connection-user-message-pattern' },
        {
          message: 'hai this is from api gateway edited',
        },
      )
    );

    console.log(response);

    return {
      status: 'success to connect to user service',
      response,
    };
  }
}
