import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;

    // Adiciona o token apenas se não for a rota de login
    if (!this.isLoginRoute(req.url)) {
      const token = this.authService.getToken();
      if (token) {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Trata erro 401 (Unauthorized)
        if (error.status === 401) {
          this.handleTokenExpired('Sessão expirada. Redirecionando para login...');
        }
        
        // Trata erro 500 com mensagem específica de JWT expirado
        if (error.status === 500 && this.isJwtExpiredError(error)) {
          this.handleTokenExpired('Token JWT expirado. Redirecionando para login...');
        }

        return throwError(() => error);
      })
    );
  }

  private isLoginRoute(url: string): boolean {
    return url.includes('/auth/login');
  }

  /**
   * Verifica se o erro é relacionado a JWT expirado
   */
  private isJwtExpiredError(error: HttpErrorResponse): boolean {
    const errorMessage = error.error?.message || error.message || '';
    const errorTrace = error.error?.trace || '';
    
    return errorMessage.toLowerCase().includes('token jwt expirado') ||
           errorMessage.toLowerCase().includes('jwt expired') ||
           errorTrace.toLowerCase().includes('jwttokenexpiredexception') ||
           errorTrace.toLowerCase().includes('expiredjwtexception');
  }

  /**
   * Trata o token expirado limpando o storage e redirecionando para login
   */
  private handleTokenExpired(message: string): void {
    // Limpa todos os dados de storage
    this.authService.clearAllStorage();

    // Redireciona para login
    this.router.navigate(['/login']);

    console.warn(message);
  }
}
