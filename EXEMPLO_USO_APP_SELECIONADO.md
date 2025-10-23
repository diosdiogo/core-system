# Como Usar o App Selecionado

## Funcionalidade Implementada

Foi criado um sistema completo para gerenciar o app selecionado pelo usuário. O app selecionado é armazenado no `sessionStorage` e gerenciado através do `AppsService` usando `BehaviorSubject`, permitindo que qualquer componente possa:

1. **Obter o app selecionado** (de forma síncrona ou assíncrona)
2. **Observar mudanças** no app selecionado
3. **Definir um novo app** como selecionado
4. **Limpar** o app selecionado

---

## Métodos Disponíveis no AppsService

### 1. `setSelectedApp(app: IApps): void`
Define o app selecionado e salva no sessionStorage.

```typescript
this.appsService.setSelectedApp(app);
```

### 2. `getSelectedApp(): IApps | null`
Retorna o app selecionado atualmente (forma síncrona).

```typescript
const selectedApp = this.appsService.getSelectedApp();
if (selectedApp) {
  console.log('App selecionado:', selectedApp.appName);
}
```

### 3. `selectedApp$: Observable<IApps | null>`
Observable para observar mudanças no app selecionado (forma reativa).

```typescript
this.appsService.selectedApp$.subscribe(app => {
  if (app) {
    console.log('App mudou:', app.appName);
  }
});
```

### 4. `clearSelectedApp(): void`
Remove o app selecionado.

```typescript
this.appsService.clearSelectedApp();
```

---

## Exemplos de Uso em Componentes

### Exemplo 1: Obter App Selecionado no ngOnInit

```typescript
import { Component, OnInit } from '@angular/core';
import { AppsService } from '../apps/apps.service';
import { IApps } from '../core/models/apps.interface';

@Component({
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html'
})
export class ExemploComponent implements OnInit {
  selectedApp: IApps | null = null;

  constructor(private appsService: AppsService) {}

  ngOnInit(): void {
    // Obter app selecionado (forma síncrona)
    this.selectedApp = this.appsService.getSelectedApp();
    
    if (this.selectedApp) {
      console.log('App atual:', this.selectedApp.appName);
    }
  }
}
```

### Exemplo 2: Observar Mudanças no App Selecionado

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppsService } from '../apps/apps.service';
import { IApps } from '../core/models/apps.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-exemplo-observable',
  templateUrl: './exemplo-observable.component.html'
})
export class ExemploObservableComponent implements OnInit, OnDestroy {
  selectedApp: IApps | null = null;
  private destroy$ = new Subject<void>();

  constructor(private appsService: AppsService) {}

  ngOnInit(): void {
    // Observar mudanças no app selecionado
    this.appsService.selectedApp$
      .pipe(takeUntil(this.destroy$))
      .subscribe(app => {
        this.selectedApp = app;
        if (app) {
          console.log('App mudou para:', app.appName);
          // Realizar ações quando o app mudar
          this.carregarDadosDoApp(app);
        }
      });
  }

  carregarDadosDoApp(app: IApps): void {
    // Lógica para carregar dados específicos do app
    console.log('Carregando dados para:', app.appName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Exemplo 3: Usar no Template HTML

```typescript
// No componente
export class ExemploComponent {
  selectedApp$ = this.appsService.selectedApp$;

  constructor(private appsService: AppsService) {}
}
```

```html
<!-- No template -->
<div *ngIf="selectedApp$ | async as app">
  <h2>App Atual: {{ app.appName }}</h2>
  <p>URL: {{ app.url }}</p>
  <p>Status: {{ app.status }}</p>
</div>
```

### Exemplo 4: Usar em um Serviço

```typescript
import { Injectable } from '@angular/core';
import { AppsService } from '../apps/apps.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeuServicoService {
  constructor(
    private http: HttpClient,
    private appsService: AppsService
  ) {}

  buscarDadosDoAppAtual(): Observable<any> {
    const app = this.appsService.getSelectedApp();
    
    if (!app) {
      throw new Error('Nenhum app selecionado');
    }

    // Usar o ID do app na requisição
    return this.http.get(`/api/dados/${app.appId}`);
  }
}
```

### Exemplo 5: Validar se Há App Selecionado (Guard)

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppsService } from '../apps/apps.service';

@Injectable({
  providedIn: 'root'
})
export class AppSelectedGuard implements CanActivate {
  constructor(
    private appsService: AppsService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const selectedApp = this.appsService.getSelectedApp();
    
    if (!selectedApp) {
      // Redireciona para seleção de apps se nenhum estiver selecionado
      this.router.navigate(['/apps']);
      return false;
    }
    
    return true;
  }
}
```

---

## Quando o App é Selecionado

O app é automaticamente selecionado e salvo nas seguintes situações:

1. **Quando há apenas 1 app disponível**: O sistema automaticamente seleciona e navega para ele
2. **Quando o usuário clica em um app**: Ao clicar em qualquer app na lista, ele é definido como selecionado
3. **Ao carregar a aplicação**: Se houver um app selecionado previamente no sessionStorage, ele é recuperado automaticamente

---

## Persistência

- O app selecionado é salvo no **sessionStorage**
- Os dados persistem enquanto a aba do navegador estiver aberta
- Ao fechar a aba/navegador, os dados são perdidos
- Para persistência permanente, altere `sessionStorage` para `localStorage` no `AppsService`

---

## Interface IApps

```typescript
export interface IApps {
  id: string;
  appId: string;
  appName: string;
  url: string;
  icon: string;
  companyId: string;
  companyName: string;
  ativo: boolean;
  status: string;
  validade: string | null;
}
```

Todos esses campos estão disponíveis ao recuperar o app selecionado!

