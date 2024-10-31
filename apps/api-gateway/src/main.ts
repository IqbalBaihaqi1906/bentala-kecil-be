import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(ApiGatewayModule);

  await app.listen(process.env.port ?? 3000);

  console.log('Api Gateway is running on port 3000');
}

bootstrap();
