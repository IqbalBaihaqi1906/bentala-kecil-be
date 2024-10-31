import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(ApiGatewayModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.port ?? 3000);

  console.log('Api Gateway is running on port 3000');
}

bootstrap();
