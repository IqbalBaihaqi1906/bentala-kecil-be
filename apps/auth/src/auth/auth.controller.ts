import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from '@app/dto/auth-dto/register.dto';
import { LoginDto } from '@app/dto/auth-dto/login.dto';

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

  @MessagePattern({ cmd: 'auth.login' })
  async login(@Payload() args: LoginDto) {
    const data: { accessToken: string; username: string } = await this.authService.login(args);

    return data;
  }

  @EventPattern('auth.login-notif')
  async handleLoginNotification(@Payload() data: string) {
    await this.authService.handleLoginNotification(data);
  }
}
