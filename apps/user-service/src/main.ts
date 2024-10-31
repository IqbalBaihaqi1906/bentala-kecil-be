import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(UserServiceModule);

  const configService = app.get(ConfigService);

  const RABBITMQ_DATA = {
    USER: configService.get('RABBITMQ_USER'),
    PASSWORD: configService.get('RABBITMQ_PASSWORD'),
    HOST: configService.get('RABBITMQ_HOST'),
    PORT: configService.get('RABBITMQ_PORT'),
  };

  // connect rabbitmq
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${RABBITMQ_DATA.USER}:${RABBITMQ_DATA.PASSWORD}@${RABBITMQ_DATA.HOST}:${RABBITMQ_DATA.PORT}`,
      ],
      queue: 'user_queue',
    },
  });

  await app.startAllMicroservices();
  // await app.listen(process.env.port ?? 3000);
}

bootstrap();
