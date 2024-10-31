import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from "@app/common/exceptions/http.excaption";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(ApiGatewayModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.port ?? 3000);

  console.log('Api Gateway is running on port 3000');
}

bootstrap();
