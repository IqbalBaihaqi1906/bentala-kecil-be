import { HttpException } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, status: number) {
    super(
      {
        message,
        status,
      },
      status,
    );
  }
}
