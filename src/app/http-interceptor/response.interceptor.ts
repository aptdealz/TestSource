import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { PageService } from '../services/page.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private page = inject(PageService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          if (this.authService.isLoggedIn) {
          }
          return throwError(error);
        }
        return throwError(error);
      })
    );
  }
}
