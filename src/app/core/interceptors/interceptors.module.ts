import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthorizationInterceptor } from './authorization-interceptor';
import { UnauthorizationInterceptor } from './unauthorization-interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizationInterceptor,
      multi: true,
    }
  ]
})
export class InterceptorsModule { }
