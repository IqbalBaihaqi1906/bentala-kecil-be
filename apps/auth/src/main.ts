import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthAppModule } from './auth.app.module';
import { HttpExceptionFilter } from "@app/common/exceptions/http.excaption";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AuthAppModule);

  const configService = app.get(ConfigService);

  const RABBITMQ_DATA = {
    USER: configService.get('RABBITMQ_USER'),
    PASSWORD: configService.get('RABBITMQ_PASSWORD'),
    HOST: configService.get('RABBITMQ_HOST'),
    PORT: configService.get('RABBITMQ_PORT'),
  };

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  // connect rabbitmq
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${RABBITMQ_DATA.USER}:${RABBITMQ_DATA.PASSWORD}@${RABBITMQ_DATA.HOST}:${RABBITMQ_DATA.PORT}`,
      ],
      queue: 'auth_queue',
    },
  });

  await app.startAllMicroservices();
  console.log('Auth service is running');
}

bootstrap();
