import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const isPublic = request.isPublic; // Menggunakan property yang akan kita tambahkan di AuthGuard
    const user = request.user;

    const now = Date.now();
    if (isPublic) {
      this.logger.log(`Public access request from IP: ${request.ip}`);
    } else if (user) {
      this.logger.log(
        `Request by user: ${user.username || 'Unknown'} from IP: ${request.ip}`,
      );
    } else {
      this.logger.warn(`Unauthorized request from IP: ${request.ip}`);
    }

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Response sent to IP: ${request.ip}, took: ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
