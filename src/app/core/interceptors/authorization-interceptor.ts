import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environment/environment';
import { AuthService } from '@core/services/auth.service';
import { publicParentRoutes } from '@core/config';
import { RouteUtils } from '@core/utils';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentParentRoute = RouteUtils.getCurrentParentRoute(this.router);
    
    const isRestrictedRoute = !publicParentRoutes.some(route => route === currentParentRoute);
    const isRequestToTheApi = request.url.includes(environment.apiUrl);

    const isToInsertTheAuthorizationHeader = isRestrictedRoute && isRequestToTheApi;

    if (isToInsertTheAuthorizationHeader) {
      const authData = this.authService.getAuthData();
      if (authData) {
        const newHeaders = request.headers.set('Authorization', `Bearer ${authData.token}`);
        request = request.clone({ headers: newHeaders });
      }
    }

    return next.handle(request);
  }
}
