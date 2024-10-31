import { HttpException, Inject, Injectable } from '@nestjs/common';
// import { RegisterDto } from '@app/dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from '@app/dto/auth-dto/register.dto';

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
}
