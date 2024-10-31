import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from "@app/prisma";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule],
})
export class AuthModule {}
