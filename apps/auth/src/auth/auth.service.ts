import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RegisterDto } from '@app/dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(args: RegisterDto): Promise<string> {
    try {
      const result: string = await this.prisma.$transaction(
        async (txClient) => {
          const hashPassword: string = await bcrypt.hash(args.password, 10);

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
      throw new HttpException(
        error.message || 'An error occurred on register',
        error.status || 500,
      );
    }
  }
}
