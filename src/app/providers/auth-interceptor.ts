import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * This is a very simple interceptor. To find more about interceptors you can read this article
 * https://medium.com/front-end-weekly/understanding-angular-http-interceptors-67078b2fcc0b
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa("client:secret")
      }
    });

    return next.handle(request)
  }
}
