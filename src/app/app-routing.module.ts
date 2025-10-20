import { NgModule } from '@angular/core';

import { AppsComponent } from './apps/apps.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root/root/root.component';

const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'apps',
    component: AppsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'root',
    component: RootComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
