import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../shared/toolbar/toolbar.component';
import { MenuItem } from '../../core/models';
import { MenuService } from '../../services/menu.service';
import { AppsService } from '../../apps/apps.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: false
})
export class MainLayoutComponent implements OnInit {
  showToolbar = false;
  isMenuOpen = false; // Inicia com menu colapsado

  private hideToolbarRoutes = ['/login', '/apps'];


  menuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private menuService: MenuService,
    private appsService: AppsService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showToolbar = !this.hideToolbarRoutes.includes(event.url);
      }
    });

    // Observa mudanças no app selecionado e carrega o menu correspondente
    this.appsService.selectedApp$.subscribe(app => {
      if (app && app.appId) {
        this.loadMenu(app.appId);
      } else {
        this.menuItems = [];
      }
    });
  }

  /**
   * Carrega o menu do app selecionado
   */
  private loadMenu(appId: string): void {
    this.menuService.getMenu(appId).subscribe({
      next: (menu) => {
        this.menuItems = menu;
        console.log('Menu carregado:', menu);
      },
      error: (error) => {
        console.error('Erro ao carregar menu:', error);
        this.menuItems = [];
      }
    });
  }

  onMenuToggle(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
