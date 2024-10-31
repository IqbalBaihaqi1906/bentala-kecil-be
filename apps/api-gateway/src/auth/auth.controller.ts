import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '@app/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() args: RegisterDto) {
    const data = await this.authService.register(args);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User has been created successfully',
      data,
    };
  }
}
