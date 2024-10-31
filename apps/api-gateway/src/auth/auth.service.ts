import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from '@app/dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private userClient: ClientProxy) {}

  async register(args: RegisterDto) {
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'auth.register' }, args),
    );

    return user;
  }
}
