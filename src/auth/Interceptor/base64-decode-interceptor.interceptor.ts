import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Base64DecodeInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const image = request.body.image;

    const buffer = Buffer.from(image, 'base64');
    const uniqueId = uuidv4();
    request.file = {
      buffer: buffer,
      originalname: `image-${uniqueId}.png`,
    };

    return next.handle();
  }
}
