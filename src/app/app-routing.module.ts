import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { appTitle } from '@core/config';
import { AuthGuard } from '@core/guards/auth-guard';

// WARNING:
// The first part of the path (parent part) of all routes below without AuthGuard
// must be added in src/app/core/config/routes.ts -> publicParentRoutes.

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login-page/login-page.module').then(m => m.LoginPageModule),
    data: { title: `${appTitle} - Login` }
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home-page/home-page.module').then(m => m.HomePageModule),
    data: { title: `${appTitle} - Home` },
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    loadChildren: () => import('./pages/not-found-page/not-found-page.module').then((m) => m.NotFoundPageModule),
    data: { title: `${appTitle} - Erro 404` }
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
