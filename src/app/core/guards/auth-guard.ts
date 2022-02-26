import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '@core/services/auth.service';

/**
 * A guard that denies the access to a route if no authenticated user is found.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const authData = this.authService.getAuthData(false);

    if (authData) {
      return true;
    }

    this.authService.setRouteToRedirectAfterLogin(state.url);
    this.router.navigateByUrl('/');

    return false;
  }
}
