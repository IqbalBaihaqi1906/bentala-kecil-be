import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { RegisterDto } from '@app/dto/auth-dto/register.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(args: RegisterDto): Promise<string> {
    try {
      const result: string = await this.prisma.$transaction(
        async (txClient) => {
          const hashPassword: string = await bcrypt.hash(args.password, 10);

          const checkUser: Prisma.UserGetPayload<{}> =
            await txClient.user.findFirst({
              where: {
                username: args.username,
              },
            });

          if (checkUser) {
            throw new RpcException({
              statusCode: 400,
              message: 'User Already Exist',
            });
          }

          const user: Prisma.UserCreateInput = await txClient.user.create({
            data: {
              username: args.username,
              password: hashPassword,
              role: args.user_type,
            },
          });

          if (args.user_type === 'ORANG_TUA') {
            await txClient.orangTua.create({
              data: {
                user_id: user.id,
                email: args.email,
                nama: args.nama,
                phone: args.phone,
                address: args.alamat,
              },
            });
          }

          return user.id;
        },
      );

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async handleUserCreateNotification(data: string): Promise<void> {
    try {
      const user: Prisma.UserGetPayload<{}> = await this.prisma.user.findUnique(
        {
          where: {
            id: data,
          },
        },
      );

      console.log('User created:', user);
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred on handleUserCreateNotification',
        error.status || 500,
      );
    }
  }
}
