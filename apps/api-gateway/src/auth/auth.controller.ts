import { Body, Controller, Get, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '@app/dto/auth-dto/register.dto';
import { LoginDto } from '@app/dto/auth-dto/login.dto';
import { IAunthenticateRequest, IJwtPayload } from "./types/type";
import { Public } from './decorators/public';
import { Roles } from './decorators/role';
import { RoleUser } from '@prisma/client';

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

  @Public()
  @Post('login')
  async login(@Body() args: LoginDto) {
    const data = await this.authService.login(args);

    return {
      statusCode: HttpStatus.OK,
      message: 'User has been logged in successfully',
      data,
    };
  }

  @Roles(RoleUser.ADMIN, RoleUser.GURU)
  @Get('authenticate-user')
  async getUsers(@Req() req: IAunthenticateRequest) {
    const user: IJwtPayload = req.user;
    const data: IJwtPayload = await this.authService.authenticatedRequest(user);

    return {
      statusCode: HttpStatus.OK,
      message: 'Users has been authenticated successfully',
      data,
    };
  }

  @Public()
  @Get('public')
  async public() {
    return {
      statusCode: HttpStatus.OK,
      message: 'This route is public',
      data: null,
    };
  }
}
