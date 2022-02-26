import { AuthData } from '..';

export interface LoginResult {
  authData: AuthData;
  routeToRedirect: string;
}
