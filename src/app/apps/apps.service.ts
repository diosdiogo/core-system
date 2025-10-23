import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IApps } from '../core/models/apps.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppsService {
  private readonly apiUrl = `${environment.apiUrl}/app-company/company`;
  private currentAppsSubject = new BehaviorSubject<IApps[]>([]);
  public currentApps$ = this.currentAppsSubject.asObservable();

  // Subject para o app selecionado
  private selectedAppSubject = new BehaviorSubject<IApps | null>(null);
  public selectedApp$ = this.selectedAppSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    const savedApps = sessionStorage.getItem('apps');
    if (savedApps) {
      this.currentAppsSubject.next(JSON.parse(savedApps));
    }

    // Recupera o app selecionado do sessionStorage
    const savedSelectedApp = sessionStorage.getItem('selectedApp');
    if (savedSelectedApp) {
      this.selectedAppSubject.next(JSON.parse(savedSelectedApp));
    }
  }

  getAppsByCompany(companyId: string): Observable<IApps[]> {
    return this.http.get<IApps[]>(`${this.apiUrl}/${companyId}`).pipe(
      tap((apps) => {
        sessionStorage.setItem('apps', JSON.stringify(apps));
        this.currentAppsSubject.next(apps);
      })
    );
  }

  getApps(): Observable<IApps[]> {
    const selectedCompany = this.authService.getSelectedCompany();
    if (!selectedCompany) {
      throw new Error('Nenhuma empresa selecionada');
    }
    return this.getAppsByCompany(selectedCompany.code);
  }

  getCurrentApps(): IApps[] {
    return this.currentAppsSubject.value;
  }

  /**
   * Define o app selecionado e salva no sessionStorage
   * @param app App a ser selecionado
   */
  setSelectedApp(app: IApps): void {
    sessionStorage.setItem('selectedApp', JSON.stringify(app));
    this.selectedAppSubject.next(app);
  }

  /**
   * Retorna o app selecionado atualmente
   * @returns App selecionado ou null
   */
  getSelectedApp(): IApps | null {
    return this.selectedAppSubject.value;
  }

  /**
   * Remove o app selecionado do sessionStorage e do BehaviorSubject
   */
  clearSelectedApp(): void {
    sessionStorage.removeItem('selectedApp');
    this.selectedAppSubject.next(null);
  }
}
