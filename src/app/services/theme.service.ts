import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IThemeConfig } from '../core/models/theme.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly apiUrl = `${environment.apiUrl}/config-tema/company`;
  private themeConfigSubject = new BehaviorSubject<IThemeConfig | null>(null);
  public themeConfig$ = this.themeConfigSubject.asObservable();

  // Tema padrão baseado na imagem fornecida
  private defaultTheme: IThemeConfig = {
    id: 'default',
    companyId: 'default',
    companyName: 'ArteVisual',
    logo: '/assets/logo-av.svg', // Logo ArteVisual
    favicon: '/assets/icon.png',
    logoToolbar: '/assets/logo-av.svg',
    // logoToolbarMin: '/assets/logo-av-min.svg', // Logo V verde
    logoToolbarMin: '/assets/logo-av.svg', // Logo V verde
    corToolbar: '#f5f5f5', // Cinza claro
    corMenuBar: '#ffffff',
    corTextoMenuBar: '#000000'
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Carrega tema salvo do sessionStorage
    const savedTheme = sessionStorage.getItem('themeConfig');
    if (savedTheme) {
      this.themeConfigSubject.next(JSON.parse(savedTheme));
    } else {
      this.themeConfigSubject.next(this.defaultTheme);
    }
  }

  getThemeConfig(): Observable<IThemeConfig> {
    const selectedCompany = this.authService.getSelectedCompany();
    if (!selectedCompany) {
      return of(this.defaultTheme);
    }

    return this.http.get<IThemeConfig>(`${this.apiUrl}/${selectedCompany.code}`).pipe(
      catchError(() => {
        console.warn('Erro ao carregar tema, usando tema padrão');
        return of(this.defaultTheme);
      })
    );
  }

  loadThemeConfig(): void {
    this.getThemeConfig().subscribe(theme => {
      sessionStorage.setItem('themeConfig', JSON.stringify(theme));
      this.themeConfigSubject.next(theme);
    });
  }

  getCurrentTheme(): IThemeConfig | null {
    return this.themeConfigSubject.value;
  }

  getToolbarColor(): string {
    const theme = this.getCurrentTheme();
    return theme?.corToolbar || this.defaultTheme.corToolbar;
  }

  getMenuBarColor(): string {
    const theme = this.getCurrentTheme();
    return theme?.corMenuBar || this.defaultTheme.corMenuBar;
  }

  getTextMenuBarColor(): string {
    const theme = this.getCurrentTheme();
    return theme?.corTextoMenuBar || this.defaultTheme.corTextoMenuBar;
  }

  getLogoToolbar(): string {
    const theme = this.getCurrentTheme();
    return theme?.logoToolbar || this.defaultTheme.logoToolbar;
  }

  getLogoToolbarMin(): string {
    const theme = this.getCurrentTheme();
    return theme?.logoToolbarMin || this.defaultTheme.logoToolbarMin;
  }
}
