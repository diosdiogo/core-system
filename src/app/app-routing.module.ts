import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppsComponent } from './apps/apps.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: AppsComponent,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
