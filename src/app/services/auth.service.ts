import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ICompany, ILoginRequest, ILoginResponse, IUser } from '../core/models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUserProfile } from '../core/models/userProfile.interface';



export interface User {
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private selectedCompanySubject = new BehaviorSubject<ICompany | null>(null);
  public selectedCompany$ = this.selectedCompanySubject.asObservable();

  private readonly apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }

    const savedSelectedCompany = sessionStorage.getItem('selectedCompany');
    if (savedSelectedCompany) {
      this.selectedCompanySubject.next(JSON.parse(savedSelectedCompany));
    } else {
      // If there is no selected company persisted but we have companies in storage, select a default
      const companiesFromStorage = this.getCompanies();
      if (companiesFromStorage && companiesFromStorage.length > 0) {
        const defaultCompany = this.selectDefaultCompany(companiesFromStorage);
        this.setSelectedCompany(defaultCompany);
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    const payload: ILoginRequest = {email, password}
    return this.http.post<ILoginResponse>(this.apiUrl, payload).pipe(
      tap((response) => {
        console.log('AuthService.login() - Saving token:', response.token);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
        sessionStorage.setItem('companies', JSON.stringify(response.companies));
        sessionStorage.setItem('profile', JSON.stringify(response.profile));
        this.currentUserSubject.next(response.user);

        // Define and persist the selected company according to the rules
        const defaultCompany = this.selectDefaultCompany(response.companies || []);
        this.setSelectedCompany(defaultCompany);

        console.log('AuthService.login() - Token saved, now checking:', sessionStorage.getItem('token') ? 'exists' : 'null');
      }),
      map(() => true)
    )
  }

  logout(): void {
    this.clearAllStorage();
  }

  clearAllStorage(): void {
    this.currentUserSubject.next(null);
    this.selectedCompanySubject.next(null);

    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('companies');
    sessionStorage.removeItem('profile');
    sessionStorage.removeItem('selectedCompany');
    sessionStorage.removeItem('apps');

    // Clear localStorage as well
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    console.log('AuthService.isAuthenticated() - token:', token ? 'exists' : 'null');
    return token !== null;
  }
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
  getCurrentUser(): IUser | null {
    return this.currentUserSubject.value;
  }
  getCompanies(): ICompany[] {
    return JSON.parse(sessionStorage.getItem('companies') || '[]');
  }
  getProfile(): IUserProfile | null {
    return JSON.parse(sessionStorage.getItem('profile') || '[]');
  }

  // Selected company helpers
  private selectDefaultCompany(companies: ICompany[]): ICompany | null {
    if (!companies || companies.length === 0) {
      return null;
    }
    if (companies.length === 1) {
      return companies[0];
    }
    const matrizMatch = companies.find((c) => (c as any)?.tipo?.toString()?.toLowerCase() === 'matriz');
    return matrizMatch || companies[0];
  }

  setSelectedCompany(company: ICompany | null): void {
    if (company) {
      sessionStorage.setItem('selectedCompany', JSON.stringify(company));
    } else {
      sessionStorage.removeItem('selectedCompany');
    }
    this.selectedCompanySubject.next(company);
  }

  getSelectedCompany(): ICompany | null {
    return this.selectedCompanySubject.value;
  }

  getSelectedCompanyCode(): string | null {
    return this.selectedCompanySubject.value?.code || null;
  }
}
