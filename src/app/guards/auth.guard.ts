import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuth = this.authService.isAuthenticated();
    const token = this.authService.getToken();

    console.log('AuthGuard - isAuthenticated:', isAuth);
    console.log('AuthGuard - token:', token ? 'exists' : 'null');
    console.log('AuthGuard - current URL:', this.router.url);

    if (isAuth) {
      return true;
    } else {
      // Redirecionar para a tela de login se não estiver autenticado
      console.log('AuthGuard - Redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
