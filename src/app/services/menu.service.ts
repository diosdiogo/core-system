import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MenuItem } from '../core/models/menu.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = environment.apiUrl;

  // Cache de menus por appId
  private menuCache: Map<string, MenuItem[]> = new Map();

  constructor(private http: HttpClient) {}

  /**
   * Retorna o menu de um app específico.
   * Se o menu já estiver em cache, retorna o cache.
   * Caso contrário, busca da API e salva no cache.
   */
  getMenu(appId: string): Observable<MenuItem[]> {
    // Verifica se o menu já está em cache
    if (this.menuCache.has(appId)) {
      console.log(`Menu do app ${appId} recuperado do cache`);
      return of(this.menuCache.get(appId)!);
    }

    // Se não estiver em cache, busca da API
    console.log(`Buscando menu do app ${appId} da API`);
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu/app/${appId}`).pipe(
      tap(menu => {
        // Salva o menu no cache após a resposta da API
        this.menuCache.set(appId, menu);
        console.log(`Menu do app ${appId} salvo no cache`);
      })
    );
  }

  /**
   * Limpa o cache de um app específico
   */
  clearMenuCache(appId: string): void {
    this.menuCache.delete(appId);
    console.log(`Cache do menu do app ${appId} removido`);
  }

  /**
   * Limpa todo o cache de menus
   */
  clearAllMenuCache(): void {
    this.menuCache.clear();
    console.log('Todo o cache de menus foi limpo');
  }

  /**
   * Força a atualização do menu de um app, ignorando o cache
   */
  refreshMenu(appId: string): Observable<MenuItem[]> {
    this.clearMenuCache(appId);
    return this.getMenu(appId);
  }
}
