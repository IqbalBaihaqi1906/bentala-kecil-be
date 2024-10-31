import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { RegisterDto } from "@app/dto/auth-dto/register.dto";
// import { RegisterDto } from '@app/dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth.register' })
  async register(@Payload() args: RegisterDto) {
    const data = await this.authService.register(args);

    return data;
  }

  @EventPattern('user.create-notification')
  async handleUserCreateNotification(@Payload() data: string) {
    await this.authService.handleUserCreateNotification(data);
  }
}
