import { HttpException, Inject, Injectable } from '@nestjs/common';
// import { RegisterDto } from '@app/dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from '@app/dto/auth-dto/register.dto';
import { LoginDto } from '@app/dto/auth-dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private userClient: ClientProxy) {}

  async register(args: RegisterDto) {
    try {
      const user: string = await firstValueFrom(
        this.userClient.send({ cmd: 'auth.register' }, args),
      );

      await this.userClient.emit('user.create-notification', user);

      return user;
    } catch (error) {
      console.log(error);
      const message = error.message || 'Error in register gateway';
      const statusCode = error.statusCode || 500;

      throw new HttpException(message, statusCode);
    }
  }

  async login(args: LoginDto) {
    try {
      const login: { accessToken: string; username: string } =
        await firstValueFrom(this.userClient.send({ cmd: 'auth.login' }, args));

      await this.userClient.emit('auth.login-notif', login.username);

      return login.accessToken;
    } catch (error) {
      console.log(error);
      const message = error.message || 'Error in login gateway';
      const statusCode = error.statusCode || 500;

      throw new HttpException(message, statusCode);
    }
  }
}
