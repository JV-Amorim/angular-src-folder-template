import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, retry, tap, throwError } from 'rxjs';

import { environment } from '@environment/environment';
import { AuthData, AuthErrors, LoginCredentials, LoginResult } from '@core/models';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authDataKey = 'auth-data';
  private readonly routeToRedirectKey = 'route-to-redirect';
  private authData: AuthData | undefined;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) { }

  /**
   * Sends, if the user is not yet authenticated, a request to the API to authenticate him.
   * @returns An Observable of AuthData, which can be subscribed to obtain the user's auth data.
   */
  login(credentials: LoginCredentials): Observable<LoginResult> {
    const routeToRedirect = this.getRouteToRedirectAfterLogin();

    if (this.authData) {
      return of({
        authData: this.authData,
        routeToRedirect
      });
    }
    
    return this.httpClient.post<string>(`${environment.apiUrl}/users/login`, credentials)
      .pipe(
        retry(2),
        tap(token => {
          this.authData = { token };
          this.saveAuthData(token);
        }),
        map(token => ({
          authData: { token },
          routeToRedirect
        })),
        catchError(error => {
          const areTheCredentialsIncorrect =
            error.error === 'User or password incorrect' ||
            error.error?.errors?.some((e: any) => e.msg === 'Invalid value');
          return throwError(() => areTheCredentialsIncorrect ? AuthErrors.Credentials : error);
        })
      );
  }

  /**
   * Gets the current route to redirect the user after the login. By default, the user is redirected to the home route.
   * @returns The route to redirect to.
   */
  getRouteToRedirectAfterLogin(): string {
    const routeToRedirect = this.sessionStorageService.getData(this.routeToRedirectKey);
    this.sessionStorageService.deleteData(this.routeToRedirectKey);
    return routeToRedirect ?? '/home';
  }

  private saveAuthData(token: string): Observable<void> {
    const wasSuccessfullySaved = this.sessionStorageService.saveData(this.authDataKey, this.authData);

    if (!wasSuccessfullySaved) {
      this.logout();
      return throwError(() => new Error('The auth data was not successfully saved.'));
    }

    return of();
  }

  /**
   * Performs the logout of the current authenticated user.
   */
  logout(): void {
    this.authData = undefined;
    this.sessionStorageService.deleteData(this.authDataKey);
    this.router.navigateByUrl('/');
  }

  /**
   * Gets the auth data of the current authenticated user.
   * @param logoutIfAuthDataIsUndefined Determines whether the user should be logged out if no auth data is found.
   * @returns The auth data, if was found, or undefined, if no data was found.
   */
  getAuthData(logoutIfAuthDataIsUndefined = true): AuthData | undefined {
    if (this.authData) {
      return this.authData;
    }

    this.authData = this.sessionStorageService.getData(this.authDataKey);
    if (!this.authData && logoutIfAuthDataIsUndefined) {
      this.logout();
    }

    return this.authData;
  }

  /**
   * Sets a route to redirect the user after the login. By default, the user is redirected to the home route.
   * @param route The URL to redirect after login completed.
   */
  setRouteToRedirectAfterLogin(route: string): void {
    this.sessionStorageService.saveData(this.routeToRedirectKey, route);
  }
}
