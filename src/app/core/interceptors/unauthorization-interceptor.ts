import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '@core/services/auth.service';

@Injectable()
export class UnauthorizationInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(error => this.handleRequestError(error)));
  }

  private handleRequestError(error: HttpErrorResponse): Observable<any> {
    const isUnauthorizedError = error.status === 401;
    if (isUnauthorizedError) {
      const authData = this.authService.getAuthData(false);
      if (authData) {
        this.authService.logout();
      }
    }
    return throwError(() => error);
  }
}
