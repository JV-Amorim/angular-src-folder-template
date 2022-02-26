import { Router } from "@angular/router";

export class RouteUtils {

  /**
   * Gets the parent route of the current Angular route. Example: the parent route
   * of "/users/update-user?id=42#last-input" is "users";
   * @param router A reference to the Angular Router service.
   * @returns The current parent route.
   */
   public static getCurrentParentRoute(router: Router): string {
    const currentRouteSplitted = router.url.split('/');
  
    if (currentRouteSplitted.length === 0) {
      return '';
    }
  
    const parentRoute = currentRouteSplitted[1];
    const parentRouteWithoutFragment = parentRoute.split('#')[0];
    const parentRouteWithoutQueryParameters = parentRouteWithoutFragment.split('?')[0];
    return parentRouteWithoutQueryParameters;
  }
}
